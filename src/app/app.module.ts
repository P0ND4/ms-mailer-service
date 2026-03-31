import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import environment from 'src/config/environment.config';
import { MailerContextModule } from 'src/contexts/mailer/infrastructure/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [environment] }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');

        if (redisUrl) {
          const parsedUrl = new URL(redisUrl);
          const dbFromPath = parsedUrl.pathname.replace('/', '');

          return {
            connection: {
              host: parsedUrl.hostname,
              port: Number(parsedUrl.port || 6379),
              username: parsedUrl.username || undefined,
              password: parsedUrl.password || undefined,
              db: dbFromPath ? Number(dbFromPath) : undefined,
            },
          };
        }

        return {
          connection: {
            host: configService.get<string>('REDIS_HOST') ?? 'localhost',
            port: configService.get<number>('REDIS_PORT') ?? 6379,
            username: configService.get<string>('REDIS_USERNAME') || undefined,
            password: configService.get<string>('REDIS_PASSWORD') || undefined,
          },
        };
      },
    }),
    MailerContextModule,
  ],
})
export class AppModule {}
