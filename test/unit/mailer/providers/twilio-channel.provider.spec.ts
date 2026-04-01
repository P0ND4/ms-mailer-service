import Twilio from 'twilio';
import { TwilioChannelProvider } from 'src/contexts/mailer/infrastructure/providers/twilio-channel.provider';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';
import { FoodaException } from 'src/contexts/shared/domain/exceptions/mailer.exception';

jest.mock('twilio', () => jest.fn());

describe('TwilioChannelProvider', () => {
  const twilioFactory = Twilio as unknown as jest.Mock;

  const createConfigService = (values: Record<string, unknown>) => ({
    get: jest.fn((key: string) => values[key]),
  });

  beforeEach(() => {
    twilioFactory.mockReset();
  });

  it('throws when sms channel lacks from and messaging service', async () => {
    const provider = new TwilioChannelProvider(createConfigService({}) as any);

    await expect(
      provider.sendSMS({ to: '+123456789', message: 'otp' }),
    ).rejects.toMatchObject({
      code: FoodaExceptionCodes.Ex2004.code,
    } as FoodaException);
  });

  it('throws when twilio credentials are missing', async () => {
    const provider = new TwilioChannelProvider(
      createConfigService({ TWILIO_SMS_FROM: '+15005550006' }) as any,
    );

    await expect(
      provider.sendSMS({ to: '+123456789', message: 'otp' }),
    ).rejects.toMatchObject({
      code: FoodaExceptionCodes.Ex2003.code,
    } as FoodaException);
  });

  it('sends sms successfully', async () => {
    const messagesCreate = jest.fn().mockResolvedValue({ sid: 'SM1' });
    const callsCreate = jest.fn();
    twilioFactory.mockReturnValue({
      messages: { create: messagesCreate },
      calls: { create: callsCreate },
    });

    const provider = new TwilioChannelProvider(
      createConfigService({
        TWILIO_ACCOUNT_SID: 'AC123',
        TWILIO_AUTH_TOKEN: 'token',
        TWILIO_SMS_FROM: '+15005550006',
      }) as any,
    );

    await provider.sendSMS({ to: '+123456789', message: 'otp' });

    expect(messagesCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '+123456789',
        body: 'otp',
        from: '+15005550006',
      }),
    );
  });

  it('wraps sms provider errors', async () => {
    const messagesCreate = jest
      .fn()
      .mockRejectedValue(new Error('twilio down'));
    twilioFactory.mockReturnValue({
      messages: { create: messagesCreate },
      calls: { create: jest.fn() },
    });

    const provider = new TwilioChannelProvider(
      createConfigService({
        TWILIO_ACCOUNT_SID: 'AC123',
        TWILIO_AUTH_TOKEN: 'token',
        TWILIO_SMS_FROM: '+15005550006',
      }) as any,
    );

    await expect(
      provider.sendSMS({ to: '+123456789', message: 'otp' }),
    ).rejects.toMatchObject({
      code: FoodaExceptionCodes.Ex2005.code,
    } as FoodaException);
  });

  it('sends whatsapp using prefixed addresses', async () => {
    const messagesCreate = jest.fn().mockResolvedValue({ sid: 'SM2' });
    twilioFactory.mockReturnValue({
      messages: { create: messagesCreate },
      calls: { create: jest.fn() },
    });

    const provider = new TwilioChannelProvider(
      createConfigService({
        TWILIO_ACCOUNT_SID: 'AC123',
        TWILIO_AUTH_TOKEN: 'token',
        TWILIO_WHATSAPP_FROM: '+14155238886',
      }) as any,
    );

    await provider.sendWhatsApp({ to: '+51999888777', message: 'hola' });

    expect(messagesCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'whatsapp:+51999888777',
        from: 'whatsapp:+14155238886',
      }),
    );
  });

  it('sends voice call with generated twiml and escapes xml content', async () => {
    const callsCreate = jest.fn().mockResolvedValue({ sid: 'CA1' });
    twilioFactory.mockReturnValue({
      messages: { create: jest.fn() },
      calls: { create: callsCreate },
    });

    const provider = new TwilioChannelProvider(
      createConfigService({
        TWILIO_ACCOUNT_SID: 'AC123',
        TWILIO_AUTH_TOKEN: 'token',
        TWILIO_VOICE_FROM: '+15005550006',
      }) as any,
    );

    await provider.sendVoiceCall({
      to: '+123456789',
      message: '5 > 4 & 3 < 7',
    });

    expect(callsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '+123456789',
        from: '+15005550006',
        twiml: expect.stringContaining('&gt;'),
      }),
    );
  });

  it('uses voiceUrl when provided', async () => {
    const callsCreate = jest.fn().mockResolvedValue({ sid: 'CA2' });
    twilioFactory.mockReturnValue({
      messages: { create: jest.fn() },
      calls: { create: callsCreate },
    });

    const provider = new TwilioChannelProvider(
      createConfigService({
        TWILIO_ACCOUNT_SID: 'AC123',
        TWILIO_AUTH_TOKEN: 'token',
        TWILIO_VOICE_FROM: '+15005550006',
      }) as any,
    );

    await provider.sendVoiceCall({
      to: '+123456789',
      message: 'voice',
      options: { voiceUrl: 'https://voice.example.com/twiml.xml' },
    });

    expect(callsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://voice.example.com/twiml.xml',
      }),
    );
  });

  it('bulk wrappers delegate to their single-send methods', async () => {
    const provider = new TwilioChannelProvider(createConfigService({}) as any);
    const smsSpy = jest.spyOn(provider, 'sendSMS').mockResolvedValue(undefined);
    const waSpy = jest
      .spyOn(provider, 'sendWhatsApp')
      .mockResolvedValue(undefined);
    const callSpy = jest
      .spyOn(provider, 'sendVoiceCall')
      .mockResolvedValue(undefined);

    await provider.sendBulkSMS({ recipients: ['+1', '+2'], message: 'sms' });
    await provider.sendBulkWhatsApp({
      recipients: ['+1', '+2'],
      message: 'wa',
    });
    await provider.sendBulkVoiceCall({
      recipients: ['+1', '+2'],
      message: 'vc',
    });

    expect(smsSpy).toHaveBeenCalledTimes(2);
    expect(waSpy).toHaveBeenCalledTimes(2);
    expect(callSpy).toHaveBeenCalledTimes(2);
  });
});
