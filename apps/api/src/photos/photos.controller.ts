import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Res,
  Query,
  Body,
  Delete,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PhotosService } from './photos.service';
import { PhotoTTL, PhotoUploadLimits } from './photos.constants';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: { fileSize: PhotoUploadLimits.MAX_FILE_SIZE },
      fileFilter: (req, file, cb) => {
        const allowed = PhotoUploadLimits.ALLOWED_MIME_TYPES.includes(
          file.mimetype as (typeof PhotoUploadLimits.ALLOWED_MIME_TYPES)[number],
        );

        if (!allowed) {
          return cb(
            new BadRequestException(
              `Unsupported file type: ${file.mimetype}. Allowed: ${PhotoUploadLimits.ALLOWED_MIME_TYPES.join(
                ', ',
              )}`,
            ),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('ttl') ttl?: string,
    @Body('passphrase') passphrase?: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const ttlSeconds = ttl ? Number(ttl) : undefined;

    if (ttlSeconds !== undefined) {
      if (!Number.isFinite(ttlSeconds) || !Number.isInteger(ttlSeconds)) {
        throw new BadRequestException('ttl must be an integer (seconds)');
      }

      if (ttlSeconds < PhotoTTL.MIN || ttlSeconds > PhotoTTL.MAX) {
        throw new BadRequestException(
          `TTL must be between ${PhotoTTL.MIN} and ${PhotoTTL.MAX} seconds`,
        );
      }
    }

    if (passphrase && passphrase.length > 128) {
      throw new BadRequestException('passphrase is too long');
    }

    const result = await this.photosService.uploadPhoto(
      file,
      ttlSeconds,
      passphrase,
    );

    return {
      success: true,
      receiptId: result.receiptId,
      expiresAt: result.expiresAt,
    };
  }

  @Get(':id/status')
  @Throttle({ default: { ttl: 60_000, limit: 60 } })
  async getStatusById(@Param('id') id: string) {
    const status = await this.photosService.getStatusById(id);
    return { success: true, ...status };
  }

  @Post(':id/unlock')
  @Throttle({ default: { ttl: 60_000, limit: 8 } })
  async unlock(
    @Param('id') id: string,
    @Body('passphrase') passphrase?: string,
  ) {
    const result = await this.photosService.unlockForView(id, passphrase ?? '');
    return { success: true, ...result };
  }

  @Get('receipt/:receiptId/status')
  @Throttle({ default: { ttl: 60_000, limit: 60 } })
  async getStatusByReceipt(@Param('receiptId') receiptId: string) {
    const status = await this.photosService.getStatusByReceipt(receiptId);
    return { success: true, ...status };
  }

  @Delete(':id')
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  async burnReceipt(@Param('id') receiptId: string) {
    if (!receiptId) return { success: true };
    await this.photosService.burnPhoto(receiptId);
    return { success: true };
  }

  @Get(':id')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  async getPhoto(
    @Param('id') id: string,
    @Query('token') token: string | undefined,
    @Res() res: Response,
  ) {
    const { meta, blob } = await this.photosService.getPhotoOnceGuarded(
      id,
      token,
    );

    res.setHeader('Content-Type', meta.mimeType);
    res.setHeader('Content-Length', meta.sizeBytes);
    res.setHeader('Content-Disposition', `inline; filename="${meta.filename}"`);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-One-Time', 'true');

    return res.send(blob);
  }
}
