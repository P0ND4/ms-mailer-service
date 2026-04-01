import nodemailer from 'nodemailer';
import { EmailChannelProvider } from 'src/contexts/mailer/infrastructure/providers/email-channel.provider';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';
import { FoodaException } from 'src/contexts/shared/domain/exceptions/mailer.exception';

describe('EmailChannelProvider', () => {
  const createConfigService = (values: Record<string, unknown>) => ({
    get: jest.fn((key: string) => values[key]),
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('throws when sender cannot be resolved', async () => {
    const configService = createConfigService({});
    const provider = new EmailChannelProvider(configService as any);

    await expect(
      provider.send({ to: 'a@company.com', subject: 'S', body: 'B' }),
    ).rejects.toMatchObject({
      code: FoodaExceptionCodes.Ex2001.code,
    } as FoodaException);
  });

  it('sends emails using nodemailer transporter', async () => {
    const sendMail = jest.fn().mockResolvedValue({ messageId: 'msg-1' });
    jest
      .spyOn(nodemailer, 'createTransport')
      .mockReturnValue({ sendMail } as any);

    const configService = createConfigService({
      MAIL_FROM: 'noreply@company.com',
      MAIL_HOST: 'smtp.company.com',
      MAIL_PORT: '465',
      MAIL_SECURE: 'true',
      MAIL_USER: 'noreply@company.com',
      MAIL_PASSWORD: 'secret',
    });
    const provider = new EmailChannelProvider(configService as any);

    await provider.send({ to: 'a@company.com', subject: 'S', body: 'B' });

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'a@company.com',
        from: 'noreply@company.com',
        subject: 'S',
        html: 'B',
        text: 'B',
      }),
    );
  });

  it('throws integration error when nodemailer send fails', async () => {
    const sendMail = jest.fn().mockRejectedValue(new Error('smtp error'));
    jest
      .spyOn(nodemailer, 'createTransport')
      .mockReturnValue({ sendMail } as any);

    const configService = createConfigService({
      MAIL_FROM: 'noreply@company.com',
      MAIL_HOST: 'smtp.company.com',
      MAIL_PORT: '465',
      MAIL_SECURE: 'true',
    });
    const provider = new EmailChannelProvider(configService as any);

    await expect(
      provider.send({ to: 'a@company.com', subject: 'S', body: 'B' }),
    ).rejects.toMatchObject({
      code: FoodaExceptionCodes.Ex2002.code,
    } as FoodaException);
  });

  it('throws when MAIL_HOST is missing during transporter creation', async () => {
    const configService = createConfigService({
      MAIL_FROM: 'noreply@company.com',
    });
    const provider = new EmailChannelProvider(configService as any);

    await expect(
      provider.send({ to: 'a@company.com', subject: 'S', body: 'B' }),
    ).rejects.toMatchObject({
      code: FoodaExceptionCodes.Ex2000.code,
    } as FoodaException);
  });

  it('sendBulk returns early when recipients list is empty', async () => {
    const configService = createConfigService({});
    const provider = new EmailChannelProvider(configService as any);
    const sendSpy = jest.spyOn(provider, 'send').mockResolvedValue(undefined);

    await provider.sendBulk({ recipients: [], subject: 'S', body: 'B' });

    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('sendBulk sends one message in bcc mode', async () => {
    const configService = createConfigService({
      MAIL_FROM: 'noreply@company.com',
    });
    const provider = new EmailChannelProvider(configService as any);
    const sendSpy = jest.spyOn(provider, 'send').mockResolvedValue(undefined);

    await provider.sendBulk({
      recipients: ['a@company.com', 'b@company.com'],
      subject: 'S',
      body: 'B',
      options: { sendAsBcc: true, bcc: ['audit@company.com'] },
    });

    expect(sendSpy).toHaveBeenCalledWith({
      to: 'noreply@company.com',
      subject: 'S',
      body: 'B',
      options: {
        sendAsBcc: true,
        bcc: ['audit@company.com', 'a@company.com', 'b@company.com'],
      },
    });
  });

  it('sendBulk sends individual emails when bcc mode is disabled', async () => {
    const configService = createConfigService({});
    const provider = new EmailChannelProvider(configService as any);
    const sendSpy = jest.spyOn(provider, 'send').mockResolvedValue(undefined);

    await provider.sendBulk({
      recipients: ['a@company.com', 'b@company.com'],
      subject: 'S',
      body: 'B',
      options: { from: 'noreply@company.com' },
    });

    expect(sendSpy).toHaveBeenCalledTimes(2);
    expect(sendSpy).toHaveBeenNthCalledWith(1, {
      to: 'a@company.com',
      subject: 'S',
      body: 'B',
      options: { from: 'noreply@company.com' },
    });
    expect(sendSpy).toHaveBeenNthCalledWith(2, {
      to: 'b@company.com',
      subject: 'S',
      body: 'B',
      options: { from: 'noreply@company.com' },
    });
  });
});
