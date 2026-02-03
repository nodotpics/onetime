import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor() {
    const options: { host: string; port: number; password?: string } = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    };

    if (process.env.REDIS_PASSWORD) {
      options.password = process.env.REDIS_PASSWORD;
    }

    this.client = new Redis(options);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) await this.client.setex(key, ttl, value);
    else await this.client.set(key, value);
  }

  async setBuffer(key: string, value: Buffer, ttl?: number): Promise<void> {
    if (ttl) await this.client.set(key, value, 'EX', ttl);
    else await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async getBuffer(key: string): Promise<Buffer | null> {
    return await this.client.getBuffer(key);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async getTTL(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  async evalBuffers(
    script: string,
    keys: string[],
    args: (string | number)[] = [],
  ): Promise<[Buffer, Buffer] | null> {
    const numKeys = keys.length;

    const commandArgs = [script, String(numKeys), ...keys, ...args.map(String)];

    const CommandCtor = (Redis as any).Command;
    const cmd = new CommandCtor('EVAL', commandArgs, { replyEncoding: null });

    const res = (await (this.client as any).sendCommand(cmd)) as
      | null
      | Buffer[]
      | (string | Buffer)[];

    if (!res) return null;

    const meta = res[0] as Buffer;
    const blob = res[1] as Buffer;

    if (!Buffer.isBuffer(meta) || !Buffer.isBuffer(blob)) {
      return null;
    }

    return [meta, blob];
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}
