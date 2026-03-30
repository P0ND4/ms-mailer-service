import { Injectable } from '@nestjs/common';
import { IPhoneUseCase } from '../../domain/use-cases/mailer/phone.use-case.interface';

@Injectable()
export class PhoneUseCase implements IPhoneUseCase {
  sendBulkSMS(recipients: string[], message: string): Promise<void> {
    console.log('[PhoneUseCase] sendBulkSMS', { recipients, message });
    return Promise.resolve();
  }

  sendBulkVoiceCall(recipients: string[], message: string): Promise<void> {
    console.log('[PhoneUseCase] sendBulkVoiceCall', { recipients, message });
    return Promise.resolve();
  }

  sendBulkWhatsApp(recipients: string[], message: string): Promise<void> {
    console.log('[PhoneUseCase] sendBulkWhatsApp', { recipients, message });
    return Promise.resolve();
  }

  sendSMS(to: string, message: string): Promise<void> {
    console.log('[PhoneUseCase] sendSMS', { to, message });
    return Promise.resolve();
  }

  sendVoiceCall(to: string, message: string): Promise<void> {
    console.log('[PhoneUseCase] sendVoiceCall', { to, message });
    return Promise.resolve();
  }

  sendWhatsApp(to: string, message: string): Promise<void> {
    console.log('[PhoneUseCase] sendWhatsApp', { to, message });
    return Promise.resolve();
  }
}
