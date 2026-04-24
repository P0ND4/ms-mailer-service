import { EmailUseCase } from 'src/contexts/mailer/application/mailer/email.use-case';
import {
  MAILER_EMAIL_JOB_SEND,
  MAILER_EMAIL_JOB_SEND_BULK,
} from 'src/contexts/mailer/infrastructure/queue/constants/queue.constants';

describe('EmailUseCase', () => {
  it('enqueues single email jobs', async () => {
    const queue = { add: jest.fn().mockResolvedValue(undefined) };
    const useCase = new EmailUseCase(queue as any);

    await useCase.sendEmail('tenant_abc', 'user@company.com', 'Subject', 'Body', {
      from: 'noreply@company.com',
    });

    expect(queue.add).toHaveBeenCalledWith(MAILER_EMAIL_JOB_SEND, {
      tenantId: 'tenant_abc',
      to: 'user@company.com',
      subject: 'Subject',
      body: 'Body',
      options: { from: 'noreply@company.com' },
    });
  });

  it('enqueues bulk email jobs', async () => {
    const queue = { add: jest.fn().mockResolvedValue(undefined) };
    const useCase = new EmailUseCase(queue as any);

    await useCase.sendBulkEmail(
      'tenant_abc',
      ['a@company.com', 'b@company.com'],
      'Subject',
      'Body',
      { sendAsBcc: true },
    );

    expect(queue.add).toHaveBeenCalledWith(MAILER_EMAIL_JOB_SEND_BULK, {
      tenantId: 'tenant_abc',
      recipients: ['a@company.com', 'b@company.com'],
      subject: 'Subject',
      body: 'Body',
      options: { sendAsBcc: true },
    });
  });
});
