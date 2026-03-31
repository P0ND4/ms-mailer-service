export abstract class IMailerRepository {
  abstract saveVerificationCode(
    hash: string,
    code: string,
    ttlSeconds: number,
  ): Promise<void>;

  abstract getVerificationCode(hash: string): Promise<string | null>;

  abstract deleteVerificationCode(hash: string): Promise<void>;
}
