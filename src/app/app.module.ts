import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import environment from 'src/config/environment.config';
import { MailerContextModule } from 'src/contexts/mailer/infrastructure/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [environment] }),
    MailerContextModule,
  ],
})
export class AppModule {}
