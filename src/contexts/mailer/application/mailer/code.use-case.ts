import { Injectable } from '@nestjs/common';
import { ICodeUseCase } from '../../domain/use-cases/mailer/code.use-case.interface';

@Injectable()
export class CodeUseCase implements ICodeUseCase {
  generateCode(length: number): string {
    const safeLength = Math.max(0, length);
    const code = Array.from({ length: safeLength }, () =>
      Math.floor(Math.random() * 10),
    ).join('');

    console.log('[CodeUseCase] generateCode', { length, code });
    return code;
  }

  validateCode(code: string, hash: string): boolean {
    const isValid = code === hash;
    console.log('[CodeUseCase] validateCode', { code, hash, isValid });
    return isValid;
  }
}
