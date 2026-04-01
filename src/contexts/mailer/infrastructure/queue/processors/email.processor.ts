import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  SendBulkEmailJobData,
  SendEmailJobData,
} from 'src/contexts/mailer/domain/types/delivery-options.type';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';
import { FoodaException } from 'src/contexts/shared/domain/exceptions/mailer.exception';
import { EmailChannelProvider } from 'src/contexts/mailer/infrastructure/providers/email-channel.provider';
import {
  MAILER_EMAIL_JOB_SEND,
  MAILER_EMAIL_JOB_SEND_BULK,
  MAILER_EMAIL_QUEUE,
} from '../constants/queue.constants';

@Processor(MAILER_EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  constructor(private readonly emailChannelProvider: EmailChannelProvider) {
    super();
  }

  async process(
    job: Job<SendEmailJobData | SendBulkEmailJobData>,
  ): Promise<void> {
    switch (job.name) {
      case MAILER_EMAIL_JOB_SEND: {
        await this.emailChannelProvider.send(job.data as SendEmailJobData);
        return;
      }

      case MAILER_EMAIL_JOB_SEND_BULK: {
        await this.emailChannelProvider.sendBulk(
          job.data as SendBulkEmailJobData,
        );
        return;
      }

      default:
        throw new FoodaException(FoodaExceptionCodes.Ex2006, 500);
    }
  }
}
