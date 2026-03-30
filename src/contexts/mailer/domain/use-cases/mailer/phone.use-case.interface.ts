export abstract class IPhoneUseCase {
  abstract sendSMS(to: string, message: string): Promise<void>;
  abstract sendBulkSMS(recipients: string[], message: string): Promise<void>;
  abstract sendWhatsApp(to: string, message: string): Promise<void>;
  abstract sendBulkWhatsApp(
    recipients: string[],
    message: string,
  ): Promise<void>;
  abstract sendVoiceCall(to: string, message: string): Promise<void>;
  abstract sendBulkVoiceCall(
    recipients: string[],
    message: string,
  ): Promise<void>;
}
