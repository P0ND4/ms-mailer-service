import { EmailController } from 'src/contexts/mailer/infrastructure/http-api/v1/mailer/controllers/email.controller';

describe('EmailController', () => {
  const emailService = {
    sendEmail: jest.fn(),
    sendBulkEmail: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends single email and returns response payload', async () => {
    const controller = new EmailController(emailService as any);

    const response = await controller.sendEmail({
      to: 'a@company.com',
      subject: 'Hello',
      body: 'Message',
      options: { from: 'noreply@company.com' },
    });

    expect(emailService.sendEmail).toHaveBeenCalledWith(
      'a@company.com',
      'Hello',
      'Message',
      { from: 'noreply@company.com' },
    );
    expect(response).toEqual({
      sent: true,
      channel: 'email',
      type: 'single',
      recipient: 'a@company.com',
    });
  });

  it('sends bulk email and returns recipients count', async () => {
    const controller = new EmailController(emailService as any);

    const response = await controller.sendBulkEmail({
      recipients: ['a@company.com', 'b@company.com'],
      subject: 'Hello',
      body: 'Message',
      options: { sendAsBcc: true },
    });

    expect(emailService.sendBulkEmail).toHaveBeenCalledWith(
      ['a@company.com', 'b@company.com'],
      'Hello',
      'Message',
      { sendAsBcc: true },
    );
    expect(response).toEqual({
      sent: true,
      channel: 'email',
      type: 'bulk',
      recipientsCount: 2,
    });
  });
});
