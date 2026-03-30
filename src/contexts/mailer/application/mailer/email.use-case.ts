import { Injectable } from '@nestjs/common';
import { IEmailUseCase } from '../../domain/use-cases/mailer/email.use-case.interface';

@Injectable()
export class EmailUseCase implements IEmailUseCase {
  sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log('[EmailUseCase] sendEmail', { to, subject, body });
    return Promise.resolve();
  }

  sendBulkEmail(
    recipients: string[],
    subject: string,
    body: string,
  ): Promise<void> {
    console.log('[EmailUseCase] sendBulkEmail', { recipients, subject, body });
    return Promise.resolve();
  }
}
