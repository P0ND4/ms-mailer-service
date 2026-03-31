import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IPhoneUseCase } from '../../domain/use-cases/mailer/phone.use-case.interface';
import {
  MAILER_PHONE_JOB_SEND_BULK_SMS,
  MAILER_PHONE_JOB_SEND_BULK_VOICE_CALL,
  MAILER_PHONE_JOB_SEND_BULK_WHATSAPP,
  MAILER_PHONE_JOB_SEND_SMS,
  MAILER_PHONE_JOB_SEND_VOICE_CALL,
  MAILER_PHONE_JOB_SEND_WHATSAPP,
  MAILER_PHONE_QUEUE,
} from 'src/contexts/mailer/infrastructure/queue/constants/queue.constants';

@Injectable()
export class PhoneUseCase implements IPhoneUseCase {
  constructor(
    @InjectQueue(MAILER_PHONE_QUEUE)
    private readonly phoneQueue: Queue,
  ) {}

  async sendBulkSMS(recipients: string[], message: string): Promise<void> {
    await this.phoneQueue.add(MAILER_PHONE_JOB_SEND_BULK_SMS, {
      recipients,
      message,
    });
  }

  async sendBulkVoiceCall(
    recipients: string[],
    message: string,
  ): Promise<void> {
    await this.phoneQueue.add(MAILER_PHONE_JOB_SEND_BULK_VOICE_CALL, {
      recipients,
      message,
    });
  }

  async sendBulkWhatsApp(recipients: string[], message: string): Promise<void> {
    await this.phoneQueue.add(MAILER_PHONE_JOB_SEND_BULK_WHATSAPP, {
      recipients,
      message,
    });
  }

  async sendSMS(to: string, message: string): Promise<void> {
    await this.phoneQueue.add(MAILER_PHONE_JOB_SEND_SMS, {
      to,
      message,
    });
  }

  async sendVoiceCall(to: string, message: string): Promise<void> {
    await this.phoneQueue.add(MAILER_PHONE_JOB_SEND_VOICE_CALL, {
      to,
      message,
    });
  }

  async sendWhatsApp(to: string, message: string): Promise<void> {
    await this.phoneQueue.add(MAILER_PHONE_JOB_SEND_WHATSAPP, {
      to,
      message,
    });
  }
}
