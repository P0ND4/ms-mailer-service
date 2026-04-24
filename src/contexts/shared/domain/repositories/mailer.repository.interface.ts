export abstract class IMailerRepository {
  abstract saveVerificationCode(
    tenantId: string,
    hash: string,
    code: string,
    ttlSeconds: number,
  ): Promise<void>;

  abstract getVerificationCode(tenantId: string, hash: string): Promise<string | null>;

  abstract getVerificationCodeTtl(tenantId: string, hash: string): Promise<number | null>;

  abstract deleteVerificationCode(tenantId: string, hash: string): Promise<void>;

  abstract getValidationAttempts(tenantId: string, hash: string): Promise<number>;

  abstract incrementValidationAttempts(
    tenantId: string,
    hash: string,
    ttlSeconds: number,
  ): Promise<number>;

  abstract resetValidationAttempts(tenantId: string, hash: string): Promise<void>;

  abstract incrementGenerationRequests(
    tenantId: string,
    hash: string,
    windowSeconds: number,
  ): Promise<number>;
}
