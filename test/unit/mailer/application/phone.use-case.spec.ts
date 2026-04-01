import { PhoneUseCase } from 'src/contexts/mailer/application/mailer/phone.use-case';
import {
  MAILER_PHONE_JOB_SEND_BULK_SMS,
  MAILER_PHONE_JOB_SEND_BULK_VOICE_CALL,
  MAILER_PHONE_JOB_SEND_BULK_WHATSAPP,
  MAILER_PHONE_JOB_SEND_SMS,
  MAILER_PHONE_JOB_SEND_VOICE_CALL,
  MAILER_PHONE_JOB_SEND_WHATSAPP,
} from 'src/contexts/mailer/infrastructure/queue/constants/queue.constants';

describe('PhoneUseCase', () => {
  const createQueue = () => ({ add: jest.fn().mockResolvedValue(undefined) });

  it('enqueues sms and bulk sms jobs', async () => {
    const queue = createQueue();
    const useCase = new PhoneUseCase(queue as any);

    await useCase.sendSMS('+1234567890', 'hello', { from: '+1987654321' });
    await useCase.sendBulkSMS(['+123', '+456'], 'hello');

    expect(queue.add).toHaveBeenNthCalledWith(1, MAILER_PHONE_JOB_SEND_SMS, {
      to: '+1234567890',
      message: 'hello',
      options: { from: '+1987654321' },
    });
    expect(queue.add).toHaveBeenNthCalledWith(
      2,
      MAILER_PHONE_JOB_SEND_BULK_SMS,
      {
        recipients: ['+123', '+456'],
        message: 'hello',
        options: undefined,
      },
    );
  });

  it('enqueues whatsapp and bulk whatsapp jobs', async () => {
    const queue = createQueue();
    const useCase = new PhoneUseCase(queue as any);

    await useCase.sendWhatsApp('+1234567890', 'wa', {
      messagingServiceSid: 'MG123',
    });
    await useCase.sendBulkWhatsApp(['+123', '+456'], 'wa');

    expect(queue.add).toHaveBeenNthCalledWith(
      1,
      MAILER_PHONE_JOB_SEND_WHATSAPP,
      {
        to: '+1234567890',
        message: 'wa',
        options: { messagingServiceSid: 'MG123' },
      },
    );
    expect(queue.add).toHaveBeenNthCalledWith(
      2,
      MAILER_PHONE_JOB_SEND_BULK_WHATSAPP,
      {
        recipients: ['+123', '+456'],
        message: 'wa',
        options: undefined,
      },
    );
  });

  it('enqueues voice and bulk voice jobs', async () => {
    const queue = createQueue();
    const useCase = new PhoneUseCase(queue as any);

    await useCase.sendVoiceCall('+1234567890', 'voice', {
      voiceUrl: 'https://voice.example.com/twiml',
    });
    await useCase.sendBulkVoiceCall(['+123', '+456'], 'voice');

    expect(queue.add).toHaveBeenNthCalledWith(
      1,
      MAILER_PHONE_JOB_SEND_VOICE_CALL,
      {
        to: '+1234567890',
        message: 'voice',
        options: { voiceUrl: 'https://voice.example.com/twiml' },
      },
    );
    expect(queue.add).toHaveBeenNthCalledWith(
      2,
      MAILER_PHONE_JOB_SEND_BULK_VOICE_CALL,
      {
        recipients: ['+123', '+456'],
        message: 'voice',
        options: undefined,
      },
    );
  });
});
