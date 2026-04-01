import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  SendBulkPhoneJobData,
  SendPhoneJobData,
} from 'src/contexts/mailer/domain/types/delivery-options.type';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';
import { FoodaException } from 'src/contexts/shared/domain/exceptions/mailer.exception';
import { TwilioChannelProvider } from 'src/contexts/mailer/infrastructure/providers/twilio-channel.provider';
import {
  MAILER_PHONE_JOB_SEND_BULK_SMS,
  MAILER_PHONE_JOB_SEND_BULK_VOICE_CALL,
  MAILER_PHONE_JOB_SEND_BULK_WHATSAPP,
  MAILER_PHONE_JOB_SEND_SMS,
  MAILER_PHONE_JOB_SEND_VOICE_CALL,
  MAILER_PHONE_JOB_SEND_WHATSAPP,
  MAILER_PHONE_QUEUE,
} from '../constants/queue.constants';

@Processor(MAILER_PHONE_QUEUE)
export class PhoneProcessor extends WorkerHost {
  constructor(private readonly twilioChannelProvider: TwilioChannelProvider) {
    super();
  }

  async process(
    job: Job<SendPhoneJobData | SendBulkPhoneJobData>,
  ): Promise<void> {
    switch (job.name) {
      case MAILER_PHONE_JOB_SEND_SMS: {
        await this.twilioChannelProvider.sendSMS(job.data as SendPhoneJobData);
        return;
      }

      case MAILER_PHONE_JOB_SEND_WHATSAPP: {
        await this.twilioChannelProvider.sendWhatsApp(
          job.data as SendPhoneJobData,
        );
        return;
      }

      case MAILER_PHONE_JOB_SEND_VOICE_CALL: {
        await this.twilioChannelProvider.sendVoiceCall(
          job.data as SendPhoneJobData,
        );
        return;
      }

      case MAILER_PHONE_JOB_SEND_BULK_SMS: {
        await this.twilioChannelProvider.sendBulkSMS(
          job.data as SendBulkPhoneJobData,
        );
        return;
      }

      case MAILER_PHONE_JOB_SEND_BULK_WHATSAPP: {
        await this.twilioChannelProvider.sendBulkWhatsApp(
          job.data as SendBulkPhoneJobData,
        );
        return;
      }

      case MAILER_PHONE_JOB_SEND_BULK_VOICE_CALL: {
        await this.twilioChannelProvider.sendBulkVoiceCall(
          job.data as SendBulkPhoneJobData,
        );
        return;
      }

      default:
        throw new FoodaException(FoodaExceptionCodes.Ex2006, 500);
    }
  }
}
