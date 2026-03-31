import { Injectable } from '@nestjs/common';
import { ICodeUseCase } from '../../domain/use-cases/mailer/code.use-case.interface';
import { IMailerRepository } from 'src/contexts/shared/domain/repositories/mailer.repository.interface';

@Injectable()
export class CodeUseCase implements ICodeUseCase {
  constructor(private readonly mailerRepository: IMailerRepository) {}

  async generateCode(
    length: number,
    hash: string,
    ttlSeconds: number = 300,
  ): Promise<string> {
    const safeLength = Math.max(4, Math.min(12, length));
    const code = Array.from({ length: safeLength }, () =>
      Math.floor(Math.random() * 10),
    ).join('');

    await this.mailerRepository.saveVerificationCode(hash, code, ttlSeconds);

    return code;
  }

  async validateCode(code: string, hash: string): Promise<boolean> {
    const storedCode = await this.mailerRepository.getVerificationCode(hash);
    const isValid = storedCode === code;

    if (isValid) await this.mailerRepository.deleteVerificationCode(hash);

    return isValid;
  }
}
