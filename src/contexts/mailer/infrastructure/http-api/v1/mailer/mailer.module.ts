import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BULL_DEFAULT_JOB_OPTIONS } from 'src/config/bull.config';
import { EmailUseCase } from 'src/contexts/mailer/application/mailer/email.use-case';
import { IEmailUseCase } from 'src/contexts/mailer/domain/use-cases/mailer/email.use-case.interface';
import { SharedModule } from 'src/contexts/shared/shared.module';
import { EmailController } from './controllers/email.controller';
import { IPhoneUseCase } from 'src/contexts/mailer/domain/use-cases/mailer/phone.use-case.interface';
import { PhoneUseCase } from 'src/contexts/mailer/application/mailer/phone.use-case';
import { PhoneController } from './controllers/phone.controller';
import { ICodeUseCase } from 'src/contexts/mailer/domain/use-cases/mailer/code.use-case.interface';
import { CodeUseCase } from 'src/contexts/mailer/application/mailer/code.use-case';
import { CodeController } from './controllers/code.controller';
import { EmailProcessor } from 'src/contexts/mailer/infrastructure/queue/processors/email.processor';
import { PhoneProcessor } from 'src/contexts/mailer/infrastructure/queue/processors/phone.processor';
import {
  MAILER_EMAIL_QUEUE,
  MAILER_PHONE_QUEUE,
} from 'src/contexts/mailer/infrastructure/queue/constants/queue.constants';
import { EmailChannelProvider } from 'src/contexts/mailer/infrastructure/providers/email-channel.provider';
import { TwilioChannelProvider } from 'src/contexts/mailer/infrastructure/providers/twilio-channel.provider';

const providers = [
  {
    provide: IEmailUseCase,
    useClass: EmailUseCase,
  },
  {
    provide: IPhoneUseCase,
    useClass: PhoneUseCase,
  },
  {
    provide: ICodeUseCase,
    useClass: CodeUseCase,
  },
];

@Module({
  imports: [
    SharedModule,
    BullModule.registerQueue(
      {
        name: MAILER_EMAIL_QUEUE,
        defaultJobOptions: BULL_DEFAULT_JOB_OPTIONS,
      },
      {
        name: MAILER_PHONE_QUEUE,
        defaultJobOptions: BULL_DEFAULT_JOB_OPTIONS,
      },
    ),
  ],
  controllers: [EmailController, PhoneController, CodeController],
  providers: [
    ...providers,
    EmailProcessor,
    PhoneProcessor,
    EmailChannelProvider,
    TwilioChannelProvider,
  ],
})
export class MailerModule {}
