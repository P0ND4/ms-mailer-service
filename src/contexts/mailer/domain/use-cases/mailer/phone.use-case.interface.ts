import { PhoneDeliveryOptions } from 'src/contexts/mailer/domain/types/delivery-options.type';

export abstract class IPhoneUseCase {
  abstract sendSMS(
    to: string,
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void>;
  abstract sendBulkSMS(
    recipients: string[],
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void>;
  abstract sendWhatsApp(
    to: string,
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void>;
  abstract sendBulkWhatsApp(
    recipients: string[],
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void>;
  abstract sendVoiceCall(
    to: string,
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void>;
  abstract sendBulkVoiceCall(
    recipients: string[],
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void>;
}
