import { Job } from 'bullmq';
import { PhoneProcessor } from 'src/contexts/mailer/infrastructure/queue/processors/phone.processor';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';
import {
  MAILER_PHONE_JOB_SEND_BULK_SMS,
  MAILER_PHONE_JOB_SEND_BULK_VOICE_CALL,
  MAILER_PHONE_JOB_SEND_BULK_WHATSAPP,
  MAILER_PHONE_JOB_SEND_SMS,
  MAILER_PHONE_JOB_SEND_VOICE_CALL,
  MAILER_PHONE_JOB_SEND_WHATSAPP,
} from 'src/contexts/mailer/infrastructure/queue/constants/queue.constants';

describe('PhoneProcessor', () => {
  const provider = {
    sendSMS: jest.fn(),
    sendBulkSMS: jest.fn(),
    sendWhatsApp: jest.fn(),
    sendBulkWhatsApp: jest.fn(),
    sendVoiceCall: jest.fn(),
    sendBulkVoiceCall: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('routes each single channel to the expected provider method', async () => {
    const processor = new PhoneProcessor(provider as any);

    await processor.process({
      name: MAILER_PHONE_JOB_SEND_SMS,
      data: { to: '+1', message: 'sms' },
    } as Job);
    await processor.process({
      name: MAILER_PHONE_JOB_SEND_WHATSAPP,
      data: { to: '+2', message: 'wa' },
    } as Job);
    await processor.process({
      name: MAILER_PHONE_JOB_SEND_VOICE_CALL,
      data: { to: '+3', message: 'vc' },
    } as Job);

    expect(provider.sendSMS).toHaveBeenCalledTimes(1);
    expect(provider.sendWhatsApp).toHaveBeenCalledTimes(1);
    expect(provider.sendVoiceCall).toHaveBeenCalledTimes(1);
  });

  it('routes each bulk channel to the expected provider method', async () => {
    const processor = new PhoneProcessor(provider as any);

    await processor.process({
      name: MAILER_PHONE_JOB_SEND_BULK_SMS,
      data: { recipients: ['+1'], message: 'sms' },
    } as Job);
    await processor.process({
      name: MAILER_PHONE_JOB_SEND_BULK_WHATSAPP,
      data: { recipients: ['+2'], message: 'wa' },
    } as Job);
    await processor.process({
      name: MAILER_PHONE_JOB_SEND_BULK_VOICE_CALL,
      data: { recipients: ['+3'], message: 'vc' },
    } as Job);

    expect(provider.sendBulkSMS).toHaveBeenCalledTimes(1);
    expect(provider.sendBulkWhatsApp).toHaveBeenCalledTimes(1);
    expect(provider.sendBulkVoiceCall).toHaveBeenCalledTimes(1);
  });

  it('throws unsupported job code for unknown names', async () => {
    const processor = new PhoneProcessor(provider as any);

    await expect(
      processor.process({ name: 'unknown', data: {} } as Job),
    ).rejects.toMatchObject({ code: FoodaExceptionCodes.Ex2006.code });
  });
});
