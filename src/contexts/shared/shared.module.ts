import { Module } from '@nestjs/common';
import { RedisModule } from 'src/database/redis.module';
import { IMailerRepository } from './domain/repositories/mailer.repository.interface';
import { RedisMailerRepository } from './infrastructure/repositories/mailer.repository';

const REPOSITORY_PROVIDERS = [
  {
    provide: IMailerRepository,
    useClass: RedisMailerRepository,
  },
];

@Module({
  imports: [RedisModule],
  providers: [...REPOSITORY_PROVIDERS],
  exports: [...REPOSITORY_PROVIDERS],
})
export class SharedModule {}
