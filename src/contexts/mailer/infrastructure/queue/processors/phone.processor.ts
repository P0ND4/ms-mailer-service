import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  MAILER_PHONE_JOB_SEND_BULK_SMS,
  MAILER_PHONE_JOB_SEND_BULK_VOICE_CALL,
  MAILER_PHONE_JOB_SEND_BULK_WHATSAPP,
  MAILER_PHONE_JOB_SEND_SMS,
  MAILER_PHONE_JOB_SEND_VOICE_CALL,
  MAILER_PHONE_JOB_SEND_WHATSAPP,
  MAILER_PHONE_QUEUE,
} from '../constants/queue.constants';

interface SendPhoneJobData {
  to: string;
  message: string;
}

interface SendBulkPhoneJobData {
  recipients: string[];
  message: string;
}

@Processor(MAILER_PHONE_QUEUE)
export class PhoneProcessor extends WorkerHost {
  async process(
    job: Job<SendPhoneJobData | SendBulkPhoneJobData>,
  ): Promise<void> {
    switch (job.name) {
      case MAILER_PHONE_JOB_SEND_SMS:
      case MAILER_PHONE_JOB_SEND_WHATSAPP:
      case MAILER_PHONE_JOB_SEND_VOICE_CALL: {
        const { to, message } = job.data as SendPhoneJobData;
        console.log(`[PhoneProcessor] ${job.name}`, { to, message });
        return;
      }

      case MAILER_PHONE_JOB_SEND_BULK_SMS:
      case MAILER_PHONE_JOB_SEND_BULK_WHATSAPP:
      case MAILER_PHONE_JOB_SEND_BULK_VOICE_CALL: {
        const { recipients, message } = job.data as SendBulkPhoneJobData;
        console.log(`[PhoneProcessor] ${job.name}`, {
          recipientsCount: recipients.length,
          message,
        });
        return;
      }

      default:
        throw new Error(`Unsupported phone job: ${job.name}`);
    }
  }
}
