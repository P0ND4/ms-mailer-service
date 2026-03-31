import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis/built/Redis';
import { IMailerRepository } from '../../domain/repositories/mailer.repository.interface';

@Injectable()
export class RedisMailerRepository implements IMailerRepository {
  constructor(@Inject('MAILER_REDIS') private readonly redis: Redis) {}

  private verificationCodeKey(hash: string): string {
    return `verification:code:${hash}`;
  }

  async saveVerificationCode(
    hash: string,
    code: string,
    ttlSeconds: number,
  ): Promise<void> {
    const safeTtl = Math.max(1, ttlSeconds);
    await this.redis.set(this.verificationCodeKey(hash), code, 'EX', safeTtl);
  }

  async getVerificationCode(hash: string): Promise<string | null> {
    return await this.redis.get(this.verificationCodeKey(hash));
  }

  async deleteVerificationCode(hash: string): Promise<void> {
    await this.redis.del(this.verificationCodeKey(hash));
  }
}
