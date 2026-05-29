import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { createBullConnectionConfig } from 'src/config/bull.config';
import environment from 'src/config/environment.config';
import { MailerContextModule } from 'src/contexts/mailer/infrastructure/mailer.module';
import { MetricsController } from 'src/contexts/shared/metrics.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [environment] }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: createBullConnectionConfig,
    }),
    MailerContextModule,
  ],
  controllers: [MetricsController],
})
export class AppModule {}
