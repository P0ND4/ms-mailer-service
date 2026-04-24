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
import { PhoneDeliveryOptions } from 'src/contexts/mailer/domain/types/delivery-options.type';

@Injectable()
export class PhoneUseCase implements IPhoneUseCase {
  constructor(
    @InjectQueue(MAILER_PHONE_QUEUE)
    private readonly phoneQueue: Queue,
  ) {}

  async sendBulkSMS(
    tenantId: string,
    recipients: string[],
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void> {
    await this.phoneQueue.add(MAILER_PHONE_JOB_SEND_BULK_SMS, {
      tenantId,
      recipients,
      message,
      options,
    });
  }

  async sendBulkVoiceCall(
    tenantId: string,
    recipients: string[],
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void> {
    await this.phoneQueue.add(MAILER_PHONE_JOB_SEND_BULK_VOICE_CALL, {
      tenantId,
      recipients,
      message,
      options,
    });
  }

  async sendBulkWhatsApp(
    tenantId: string,
    recipients: string[],
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void> {
    await this.phoneQueue.add(MAILER_PHONE_JOB_SEND_BULK_WHATSAPP, {
      tenantId,
      recipients,
      message,
      options,
    });
  }

  async sendSMS(
    tenantId: string,
    to: string,
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void> {
    await this.phoneQueue.add(MAILER_PHONE_JOB_SEND_SMS, {
      tenantId,
      to,
      message,
      options,
    });
  }

  async sendVoiceCall(
    tenantId: string,
    to: string,
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void> {
    await this.phoneQueue.add(MAILER_PHONE_JOB_SEND_VOICE_CALL, {
      tenantId,
      to,
      message,
      options,
    });
  }

  async sendWhatsApp(
    tenantId: string,
    to: string,
    message: string,
    options?: PhoneDeliveryOptions,
  ): Promise<void> {
    await this.phoneQueue.add(MAILER_PHONE_JOB_SEND_WHATSAPP, {
      tenantId,
      to,
      message,
      options,
    });
  }
}
