import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ICodeUseCase } from '../../domain/use-cases/mailer/code.use-case.interface';
import { IMailerRepository } from 'src/contexts/shared/domain/repositories/mailer.repository.interface';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';
import { FoodaException } from 'src/contexts/shared/domain/exceptions/mailer.exception';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'node:crypto';

@Injectable()
export class CodeUseCase implements ICodeUseCase {
  private readonly logger = new Logger(CodeUseCase.name);

  constructor(
    private readonly mailerRepository: IMailerRepository,
    private readonly configService: ConfigService,
  ) {}

  async generateCode(
    length: number,
    hash: string,
    ttlSeconds: number = 300,
  ): Promise<string> {
    const rateLimitWindow = this.getNumberEnv(
      'OTP_GENERATE_RATE_LIMIT_WINDOW_SECONDS',
      60,
    );
    const maxGenerateRequests = this.getNumberEnv(
      'OTP_GENERATE_RATE_LIMIT_MAX_REQUESTS',
      3,
    );

    const generationRequests =
      await this.mailerRepository.incrementGenerationRequests(
        hash,
        rateLimitWindow,
      );

    if (generationRequests > maxGenerateRequests) {
      this.logger.warn(
        `[OTP_AUDIT] event=generate-blocked hash=${this.maskHash(hash)} reason=rate-limit requests=${generationRequests}`,
      );
      throw new FoodaException(
        FoodaExceptionCodes.Ex3001,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const safeLength = Math.max(4, Math.min(12, length));
    const code = Array.from({ length: safeLength }, () =>
      randomInt(0, 10),
    ).join('');

    await this.mailerRepository.saveVerificationCode(hash, code, ttlSeconds);
    await this.mailerRepository.resetValidationAttempts(hash);

    this.logger.log(
      `[OTP_AUDIT] event=generated hash=${this.maskHash(hash)} ttl=${ttlSeconds}`,
    );

    return code;
  }

  async validateCode(code: string, hash: string): Promise<boolean> {
    const maxValidateAttempts = this.getNumberEnv(
      'OTP_MAX_VALIDATE_ATTEMPTS',
      5,
    );
    const fallbackAttemptsTtlSeconds = this.getNumberEnv(
      'OTP_VALIDATE_ATTEMPTS_TTL_SECONDS',
      900,
    );

    const existingAttempts =
      await this.mailerRepository.getValidationAttempts(hash);
    if (existingAttempts >= maxValidateAttempts) {
      await this.mailerRepository.deleteVerificationCode(hash);
      this.logger.warn(
        `[OTP_AUDIT] event=validate-blocked hash=${this.maskHash(hash)} reason=max-attempts attempts=${existingAttempts}`,
      );
      throw new FoodaException(
        FoodaExceptionCodes.Ex3000,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const storedCode = await this.mailerRepository.getVerificationCode(hash);
    const isValid = storedCode === code;

    if (!isValid) {
      const codeTtlSeconds =
        await this.mailerRepository.getVerificationCodeTtl(hash);
      const attemptsTtlSeconds = codeTtlSeconds ?? fallbackAttemptsTtlSeconds;

      const attempts = await this.mailerRepository.incrementValidationAttempts(
        hash,
        attemptsTtlSeconds,
      );

      this.logger.warn(
        `[OTP_AUDIT] event=validate-failed hash=${this.maskHash(hash)} attempts=${attempts}`,
      );

      if (attempts >= maxValidateAttempts) {
        await this.mailerRepository.deleteVerificationCode(hash);
        this.logger.warn(
          `[OTP_AUDIT] event=validate-blocked hash=${this.maskHash(hash)} reason=max-attempts attempts=${attempts}`,
        );
        throw new FoodaException(
          FoodaExceptionCodes.Ex3000,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      return false;
    }

    await this.mailerRepository.deleteVerificationCode(hash);
    await this.mailerRepository.resetValidationAttempts(hash);

    this.logger.log(
      `[OTP_AUDIT] event=validated hash=${this.maskHash(hash)} status=success`,
    );

    return true;
  }

  private getNumberEnv(key: string, defaultValue: number): number {
    const rawValue = this.configService.get<number | string>(key);
    if (typeof rawValue === 'number') return rawValue;

    const parsed = Number.parseInt(String(rawValue ?? ''), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
  }

  private maskHash(hash: string): string {
    const normalized = hash.trim();
    if (normalized.length <= 8) return normalized;

    return `${normalized.slice(0, 4)}...${normalized.slice(-4)}`;
  }
}
