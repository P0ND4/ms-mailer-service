import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  MAILER_EMAIL_JOB_SEND,
  MAILER_EMAIL_JOB_SEND_BULK,
  MAILER_EMAIL_QUEUE,
} from '../constants/queue.constants';

interface SendEmailJobData {
  to: string;
  subject: string;
  body: string;
}

interface SendBulkEmailJobData {
  recipients: string[];
  subject: string;
  body: string;
}

@Processor(MAILER_EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  async process(
    job: Job<SendEmailJobData | SendBulkEmailJobData>,
  ): Promise<void> {
    switch (job.name) {
      case MAILER_EMAIL_JOB_SEND: {
        const { to, subject, body } = job.data as SendEmailJobData;
        console.log('[EmailProcessor] send-email', { to, subject, body });
        return;
      }

      case MAILER_EMAIL_JOB_SEND_BULK: {
        const { recipients, subject, body } = job.data as SendBulkEmailJobData;
        console.log('[EmailProcessor] send-bulk-email', {
          recipientsCount: recipients.length,
          subject,
          body,
        });
        return;
      }

      default:
        throw new Error(`Unsupported email job: ${job.name}`);
    }
  }
}
