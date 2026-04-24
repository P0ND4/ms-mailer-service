import { PhoneController } from 'src/contexts/mailer/infrastructure/http-api/v1/mailer/controllers/phone.controller';

describe('PhoneController', () => {
  const phoneUseCase = {
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

  it('sends sms and returns channel metadata', async () => {
    const controller = new PhoneController(phoneUseCase as any);

    const response = await controller.sendSMS('tenant_abc', {
      to: '+51999888777',
      message: 'OTP 1234',
      options: { from: '+15005550006' },
    });

    expect(phoneUseCase.sendSMS).toHaveBeenCalledWith(
      'tenant_abc',
      '+51999888777',
      'OTP 1234',
      { from: '+15005550006' },
    );
    expect(response).toEqual({
      sent: true,
      channel: 'phone',
      type: 'sms-single',
      recipient: '+51999888777',
    });
  });

  it('sends bulk sms and returns recipients count', async () => {
    const controller = new PhoneController(phoneUseCase as any);

    const response = await controller.sendBulkSMS('tenant_abc', {
      recipients: ['+1', '+2'],
      message: 'bulk',
      options: { from: '+15005550006' },
    });

    expect(phoneUseCase.sendBulkSMS).toHaveBeenCalledWith(
      'tenant_abc',
      ['+1', '+2'],
      'bulk',
      { from: '+15005550006' },
    );
    expect(response).toEqual({
      sent: true,
      channel: 'phone',
      type: 'sms-bulk',
      recipientsCount: 2,
    });
  });

  it('sends whatsapp variants', async () => {
    const controller = new PhoneController(phoneUseCase as any);

    const single = await controller.sendWhatsApp('tenant_abc', {
      to: '+1',
      message: 'wa',
      options: { messagingServiceSid: 'MG1' },
    });
    const bulk = await controller.sendBulkWhatsApp('tenant_abc', {
      recipients: ['+1', '+2'],
      message: 'bulk-wa',
      options: { messagingServiceSid: 'MG1' },
    });

    expect(phoneUseCase.sendWhatsApp).toHaveBeenCalledWith('tenant_abc', '+1', 'wa', {
      messagingServiceSid: 'MG1',
    });
    expect(phoneUseCase.sendBulkWhatsApp).toHaveBeenCalledWith(
      'tenant_abc',
      ['+1', '+2'],
      'bulk-wa',
      { messagingServiceSid: 'MG1' },
    );

    expect(single.type).toBe('whatsapp-single');
    expect(bulk.type).toBe('whatsapp-bulk');
  });

  it('sends voice call variants', async () => {
    const controller = new PhoneController(phoneUseCase as any);

    const single = await controller.sendVoiceCall('tenant_abc', {
      to: '+1',
      message: 'voice',
      options: { voiceUrl: 'https://voice.example.com' },
    });
    const bulk = await controller.sendBulkVoiceCall('tenant_abc', {
      recipients: ['+1', '+2'],
      message: 'bulk-voice',
      options: { voiceUrl: 'https://voice.example.com' },
    });

    expect(phoneUseCase.sendVoiceCall).toHaveBeenCalledWith('tenant_abc', '+1', 'voice', {
      voiceUrl: 'https://voice.example.com',
    });
    expect(phoneUseCase.sendBulkVoiceCall).toHaveBeenCalledWith(
      'tenant_abc',
      ['+1', '+2'],
      'bulk-voice',
      { voiceUrl: 'https://voice.example.com' },
    );

    expect(single.type).toBe('voice-call-single');
    expect(bulk.type).toBe('voice-call-bulk');
  });
});
