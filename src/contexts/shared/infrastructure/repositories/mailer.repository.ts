import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis/built/Redis';
import { IMailerRepository } from '../../domain/repositories/mailer.repository.interface';

@Injectable()
export class RedisMailerRepository implements IMailerRepository {
  constructor(@Inject('MAILER_REDIS') private readonly redis: Redis) {}

  private verificationCodeKey(hash: string): string {
    return `verification:code:${hash}`;
  }

  private verificationAttemptsKey(hash: string): string {
    return `verification:code:attempts:${hash}`;
  }

  private generationRateKey(hash: string): string {
    return `verification:code:rate:${hash}`;
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

  async getVerificationCodeTtl(hash: string): Promise<number | null> {
    const ttl = await this.redis.ttl(this.verificationCodeKey(hash));
    return ttl > 0 ? ttl : null;
  }

  async deleteVerificationCode(hash: string): Promise<void> {
    await this.redis.del(this.verificationCodeKey(hash));
  }

  async getValidationAttempts(hash: string): Promise<number> {
    const attempts = await this.redis.get(this.verificationAttemptsKey(hash));
    return Number.parseInt(attempts ?? '0', 10) || 0;
  }

  async incrementValidationAttempts(
    hash: string,
    ttlSeconds: number,
  ): Promise<number> {
    const key = this.verificationAttemptsKey(hash);
    const attempts = await this.redis.incr(key);

    if (attempts === 1) await this.redis.expire(key, Math.max(1, ttlSeconds));

    return attempts;
  }

  async resetValidationAttempts(hash: string): Promise<void> {
    await this.redis.del(this.verificationAttemptsKey(hash));
  }

  async incrementGenerationRequests(
    hash: string,
    windowSeconds: number,
  ): Promise<number> {
    const key = this.generationRateKey(hash);
    const requests = await this.redis.incr(key);

    if (requests === 1)
      await this.redis.expire(key, Math.max(1, windowSeconds));

    return requests;
  }
}
