import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { randomBytes } from 'crypto';
import { PhotoTTL } from './photos.constants';
import * as sharp from 'sharp';
import { hash, verify } from '@node-rs/argon2';

interface MulterFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface PhotoMeta {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  expiresAt: string;
  passphraseHash: string | undefined;
}

type ReceiptData = {
  id: string;
  createdAt: string;
  expiresAt: string;
};

type ViewTokenData = { id: string };

const LUA_GET_META_BLOB_AND_DEL = `
local meta = redis.call("GET", KEYS[1])
if not meta then return nil end

local blob = redis.call("GET", KEYS[2])
if not blob then
  redis.call("DEL", KEYS[1])
  return nil
end

redis.call("DEL", KEYS[1])
redis.call("DEL", KEYS[2])

return { meta, blob }
`;

const LUA_BURN_PHOTO = `
  local metaKey = KEYS[1]
  local blobKey = KEYS[2]

  local metaExists = redis.call("EXISTS", metaKey)
  local blobExists = redis.call("EXISTS", blobKey)

  if metaExists == 0 and blobExists == 0 then
    return 0
  end

  redis.call("DEL", metaKey, blobKey)
  return 1
`;

@Injectable()
export class PhotosService {
  constructor(private readonly redisService: RedisService) {}

  async uploadPhoto(
    file: MulterFile,
    ttl?: number,
    passphrase?: string,
  ): Promise<{ receiptId: string; expiresAt: string }> {
    if (!file?.buffer?.length) throw new BadRequestException('File is empty');

    const expiresInSeconds = ttl ?? PhotoTTL.DEFAULT;
    if (expiresInSeconds < PhotoTTL.MIN || expiresInSeconds > PhotoTTL.MAX) {
      throw new BadRequestException(
        `TTL must be between ${PhotoTTL.MIN} and ${PhotoTTL.MAX} seconds`,
      );
    }

    const passphraseHash =
      passphrase && passphrase.trim().length > 0
        ? await hash(passphrase)
        : undefined;

    const receiptId = this.generateId();
    const id = this.generateId();

    const now = new Date();
    const createdAt = now.toISOString();
    const expiresAt = new Date(
      now.getTime() + expiresInSeconds * 1000,
    ).toISOString();

    const compressed = await this.compressToWebp(file);

    const meta: PhotoMeta = {
      id,
      filename: compressed.filename,
      mimeType: compressed.mimeType,
      sizeBytes: compressed.sizeBytes,
      createdAt,
      expiresAt,
      passphraseHash,
    };

    const receiptData: ReceiptData = { id, createdAt, expiresAt };

    await this.redisService.setBuffer(
      this.photoBlobKey(id),
      compressed.buffer,
      expiresInSeconds,
    );
    await this.redisService.set(
      this.photoMetaKey(id),
      JSON.stringify(meta),
      expiresInSeconds,
    );

    await this.redisService.set(
      this.receiptKey(receiptId),
      JSON.stringify(receiptData),
      expiresInSeconds,
    );

    return { receiptId, expiresAt };
  }

  async getPhotoOnce(id: string): Promise<{ meta: PhotoMeta; blob: Buffer }> {
    const res = await this.redisService.evalBuffers(
      LUA_GET_META_BLOB_AND_DEL,
      [this.photoMetaKey(id), this.photoBlobKey(id)],
      [],
    );

    if (!res) throw new NotFoundException('Photo not found or has expired');

    const [metaBuf, blobBuf] = res;

    const parsed: unknown = JSON.parse(metaBuf.toString('utf8'));
    if (!this.isPhotoMeta(parsed))
      throw new Error('Corrupted photo meta in redis');

    const meta: PhotoMeta = parsed;

    return { meta, blob: blobBuf };
  }

  async getPhotoOnceGuarded(id: string, token?: string) {
    const metaRaw = await this.redisService.get(this.photoMetaKey(id));
    if (!metaRaw) throw new NotFoundException('Photo not found or has expired');

    const parsed: unknown = JSON.parse(metaRaw);
    if (!this.isPhotoMeta(parsed))
      throw new Error('Corrupted photo meta in redis');

    const meta: PhotoMeta = parsed;

    if (meta.passphraseHash) {
      if (!token) throw new BadRequestException('token is required');

      const tokenRaw = await this.redisService.get(this.viewTokenKey(token));
      if (!tokenRaw)
        throw new BadRequestException('token is invalid or expired');

      const data = JSON.parse(tokenRaw) as { id: string };
      if (data.id !== id) throw new BadRequestException('token mismatch');

      await this.redisService.delete(this.viewTokenKey(token));
    }

    return await this.getPhotoOnce(id);
  }

  async getStatusById(id: string) {
    const metaKey = this.photoMetaKey(id);

    const exists = await this.redisService.exists(metaKey);
    if (!exists) {
      return {
        id,
        exists: false,
        isExpired: true,
        isConsumed: true,
        createdAt: null,
        expiresAt: null,
        ttlSeconds: 0,
      };
    }

    const metaRaw = await this.redisService.get(metaKey);
    if (!metaRaw) {
      return {
        id,
        exists: false,
        isExpired: true,
        isConsumed: true,
        createdAt: null,
        expiresAt: null,
        ttlSeconds: 0,
      };
    }

    const parsed: unknown = JSON.parse(metaRaw);
    if (!this.isPhotoMeta(parsed))
      throw new Error('Corrupted photo meta in redis');

    const meta: PhotoMeta = parsed;
    const ttlSeconds = Math.max(0, await this.redisService.getTTL(metaKey));

    return {
      id,
      exists: true,
      isExpired: ttlSeconds <= 0,
      isConsumed: false,
      createdAt: meta.createdAt,
      expiresAt: meta.expiresAt,
      ttlSeconds,
      sizeBytes: meta.sizeBytes,
      isWithPassword: Boolean(meta.passphraseHash),
    };
  }

  async getStatusByReceipt(receiptId: string) {
    const rKey = this.receiptKey(receiptId);
    const raw = await this.redisService.get(rKey);

    if (!raw) {
      return {
        receiptId,
        exists: false,
        isExpired: true,
        isConsumed: true,
        id: null,
        shareUrl: null,
        createdAt: null,
        expiresAt: null,
        ttlSeconds: 0,
      };
    }

    const receipt = JSON.parse(raw) as ReceiptData;
    const ttlSeconds = Math.max(0, await this.redisService.getTTL(rKey));

    const photoExists = await this.redisService.exists(
      this.photoMetaKey(receipt.id),
    );

    return {
      receiptId,
      exists: true,
      isExpired: ttlSeconds <= 0,
      isConsumed: !photoExists,
      id: receipt.id,
      createdAt: receipt.createdAt,
      expiresAt: receipt.expiresAt,
      ttlSeconds,
    };
  }

  async unlockForView(
    id: string,
    passphrase: string,
  ): Promise<{ token: string; tokenExpiresIn: number; photoUrl: string }> {
    const metaRaw = await this.redisService.get(this.photoMetaKey(id));
    if (!metaRaw) throw new NotFoundException('Photo not found or has expired');

    const parsed: unknown = JSON.parse(metaRaw);
    if (!this.isPhotoMeta(parsed))
      throw new Error('Corrupted photo meta in redis');

    const meta: PhotoMeta = parsed;

    if (meta.passphraseHash) {
      const ok = await verify(meta.passphraseHash, passphrase);
      if (!ok) throw new BadRequestException('Invalid passphrase');
    }

    const tokenTtl = 90;
    const token = this.generateToken();

    const payload: ViewTokenData = { id };
    await this.redisService.set(
      this.viewTokenKey(token),
      JSON.stringify(payload),
      tokenTtl,
    );

    return {
      token,
      tokenExpiresIn: tokenTtl,
      photoUrl: `${id}?token=${token}`,
    };
  }

  async burnPhoto(id: string): Promise<void> {
    await this.redisService.evalBuffers(
      LUA_BURN_PHOTO,
      [this.photoMetaKey(id), this.photoBlobKey(id)],
      [],
    );
  }

  private async compressToWebp(file: MulterFile) {
    const out = await sharp(file.buffer, { failOnError: false })
      .rotate()
      .resize({
        width: 1920,
        height: 1920,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    const baseName = file.originalname.replace(/\.[^.]+$/, '');
    return {
      buffer: out,
      filename: `${baseName}.webp`,
      mimeType: 'image/webp',
      sizeBytes: out.length,
    };
  }

  private generateToken(): string {
    return randomBytes(16).toString('hex');
  }

  private viewTokenKey(token: string) {
    return `photo:viewtoken:${token}`;
  }

  private photoMetaKey(id: string) {
    return `photo:meta:${id}`;
  }

  private photoBlobKey(id: string) {
    return `photo:blob:${id}`;
  }

  private receiptKey(receiptId: string) {
    return `receipt:${receiptId}`;
  }

  private generateId(): string {
    return randomBytes(16).toString('hex');
  }

  private isPhotoMeta(v: unknown): v is PhotoMeta {
    if (!v || typeof v !== 'object') return false;
    const o = v as Record<string, unknown>;

    return (
      typeof o.id === 'string' &&
      typeof o.filename === 'string' &&
      typeof o.mimeType === 'string' &&
      typeof o.sizeBytes === 'number' &&
      typeof o.createdAt === 'string' &&
      typeof o.expiresAt === 'string' &&
      (typeof o.passphraseHash === 'string' ||
        typeof o.passphraseHash === 'undefined')
    );
  }
}
