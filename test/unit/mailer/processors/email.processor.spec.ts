import { Job } from 'bullmq';
import { EmailProcessor } from 'src/contexts/mailer/infrastructure/queue/processors/email.processor';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';
import {
  MAILER_EMAIL_JOB_SEND,
  MAILER_EMAIL_JOB_SEND_BULK,
} from 'src/contexts/mailer/infrastructure/queue/constants/queue.constants';

describe('EmailProcessor', () => {
  const provider = {
    send: jest.fn(),
    sendBulk: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('routes single email job to provider', async () => {
    const processor = new EmailProcessor(provider as any);

    await processor.process({
      name: MAILER_EMAIL_JOB_SEND,
      data: {
        to: 'a@demo.com',
        subject: 'Hello',
        text: 'Hi',
      },
    } as Job);

    expect(provider.send).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'a@demo.com', subject: 'Hello' }),
    );
  });

  it('routes bulk email job to provider', async () => {
    const processor = new EmailProcessor(provider as any);

    await processor.process({
      name: MAILER_EMAIL_JOB_SEND_BULK,
      data: {
        recipients: ['a@demo.com', 'b@demo.com'],
        subject: 'Hello',
        text: 'Hi',
      },
    } as Job);

    expect(provider.sendBulk).toHaveBeenCalledWith(
      expect.objectContaining({ recipients: ['a@demo.com', 'b@demo.com'] }),
    );
  });

  it('throws unsupported job code for unknown names', async () => {
    const processor = new EmailProcessor(provider as any);

    await expect(
      processor.process({
        name: 'unknown',
        data: {
          to: 'a@demo.com',
          subject: 'Hello',
        },
      } as Job),
    ).rejects.toMatchObject({ code: FoodaExceptionCodes.Ex2006.code });
  });
});
