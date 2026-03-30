import { Module } from '@nestjs/common';
import { MailerModule } from './http-api/v1/mailer/mailer.module';

@Module({
  imports: [MailerModule],
})
export class MailerContextModule {}
