import { EmailDeliveryOptions } from 'src/contexts/mailer/domain/types/delivery-options.type';

export abstract class IEmailUseCase {
  abstract sendEmail(
    to: string,
    subject: string,
    body: string,
    options?: EmailDeliveryOptions,
  ): Promise<void>;
  abstract sendBulkEmail(
    recipients: string[],
    subject: string,
    body: string,
    options?: EmailDeliveryOptions,
  ): Promise<void>;
}
