import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis/built/Redis';
import { IMailerRepository } from '../../domain/repositories/mailer.repository.interface';

@Injectable()
export class RedisMailerRepository implements IMailerRepository {
  constructor(
    @Inject('MAILER_REDIS') private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {}
}
