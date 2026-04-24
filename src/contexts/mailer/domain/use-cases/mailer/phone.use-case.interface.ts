import { PhoneDeliveryOptions } from 'src/contexts/mailer/domain/types/delivery-options.type';

export abstract class IPhoneUseCase {
  abstract sendSMS(
    tenantId: string,
    to: string,
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void>;
  abstract sendBulkSMS(
    tenantId: string,
    recipients: string[],
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void>;
  abstract sendWhatsApp(
    tenantId: string,
    to: string,
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void>;
  abstract sendBulkWhatsApp(
    tenantId: string,
    recipients: string[],
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void>;
  abstract sendVoiceCall(
    tenantId: string,
    to: string,
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void>;
  abstract sendBulkVoiceCall(
    tenantId: string,
    recipients: string[],
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void>;
}
