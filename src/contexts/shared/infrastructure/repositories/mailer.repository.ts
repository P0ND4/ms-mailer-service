import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis/built/Redis';
import { IMailerRepository } from '../../domain/repositories/mailer.repository.interface';

@Injectable()
export class RedisMailerRepository implements IMailerRepository {
  constructor(@Inject('MAILER_REDIS') private readonly redis: Redis) {}

  private verificationCodeKey(tenantId: string, hash: string): string {
    return `${tenantId}:verification:code:${hash}`;
  }

  private verificationAttemptsKey(tenantId: string, hash: string): string {
    return `${tenantId}:verification:code:attempts:${hash}`;
  }

  private generationRateKey(tenantId: string, hash: string): string {
    return `${tenantId}:verification:code:rate:${hash}`;
  }

  async saveVerificationCode(
    tenantId: string,
    hash: string,
    code: string,
    ttlSeconds: number,
  ): Promise<void> {
    const safeTtl = Math.max(1, ttlSeconds);
    await this.redis.set(this.verificationCodeKey(tenantId, hash), code, 'EX', safeTtl);
  }

  async getVerificationCode(tenantId: string, hash: string): Promise<string | null> {
    return await this.redis.get(this.verificationCodeKey(tenantId, hash));
  }

  async getVerificationCodeTtl(tenantId: string, hash: string): Promise<number | null> {
    const ttl = await this.redis.ttl(this.verificationCodeKey(tenantId, hash));
    return ttl > 0 ? ttl : null;
  }

  async deleteVerificationCode(tenantId: string, hash: string): Promise<void> {
    await this.redis.del(this.verificationCodeKey(tenantId, hash));
  }

  async getValidationAttempts(tenantId: string, hash: string): Promise<number> {
    const attempts = await this.redis.get(this.verificationAttemptsKey(tenantId, hash));
    return Number.parseInt(attempts ?? '0', 10) || 0;
  }

  async incrementValidationAttempts(
    tenantId: string,
    hash: string,
    ttlSeconds: number,
  ): Promise<number> {
    const key = this.verificationAttemptsKey(tenantId, hash);
    const attempts = await this.redis.incr(key);

    if (attempts === 1) await this.redis.expire(key, Math.max(1, ttlSeconds));

    return attempts;
  }

  async resetValidationAttempts(tenantId: string, hash: string): Promise<void> {
    await this.redis.del(this.verificationAttemptsKey(tenantId, hash));
  }

  async incrementGenerationRequests(
    tenantId: string,
    hash: string,
    windowSeconds: number,
  ): Promise<number> {
    const key = this.generationRateKey(tenantId, hash);
    const requests = await this.redis.incr(key);

    if (requests === 1)
      await this.redis.expire(key, Math.max(1, windowSeconds));

    return requests;
  }
}
