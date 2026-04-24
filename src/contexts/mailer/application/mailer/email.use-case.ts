import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IEmailUseCase } from '../../domain/use-cases/mailer/email.use-case.interface';
import {
  MAILER_EMAIL_JOB_SEND,
  MAILER_EMAIL_JOB_SEND_BULK,
  MAILER_EMAIL_QUEUE,
} from 'src/contexts/mailer/infrastructure/queue/constants/queue.constants';
import { EmailDeliveryOptions } from 'src/contexts/mailer/domain/types/delivery-options.type';

@Injectable()
export class EmailUseCase implements IEmailUseCase {
  constructor(
    @InjectQueue(MAILER_EMAIL_QUEUE)
    private readonly emailQueue: Queue,
  ) {}

  async sendEmail(
    tenantId: string,
    to: string,
    subject: string,
    body: string,
    options?: EmailDeliveryOptions,
  ): Promise<void> {
    await this.emailQueue.add(MAILER_EMAIL_JOB_SEND, {
      tenantId,
      to,
      subject,
      body,
      options,
    });
  }

  async sendBulkEmail(
    tenantId: string,
    recipients: string[],
    subject: string,
    body: string,
    options?: EmailDeliveryOptions,
  ): Promise<void> {
    await this.emailQueue.add(MAILER_EMAIL_JOB_SEND_BULK, {
      tenantId,
      recipients,
      subject,
      body,
      options,
    });
  }
}
