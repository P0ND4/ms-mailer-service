export abstract class IMailerRepository {
  abstract saveVerificationCode(
    hash: string,
    code: string,
    ttlSeconds: number,
  ): Promise<void>;

  abstract getVerificationCode(hash: string): Promise<string | null>;

  abstract getVerificationCodeTtl(hash: string): Promise<number | null>;

  abstract deleteVerificationCode(hash: string): Promise<void>;

  abstract getValidationAttempts(hash: string): Promise<number>;

  abstract incrementValidationAttempts(
    hash: string,
    ttlSeconds: number,
  ): Promise<number>;

  abstract resetValidationAttempts(hash: string): Promise<void>;

  abstract incrementGenerationRequests(
    hash: string,
    windowSeconds: number,
  ): Promise<number>;
}
