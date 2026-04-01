import { ConfigService } from '@nestjs/config';

export const BULL_DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
  removeOnComplete: 1000,
  removeOnFail: 1000,
};

export const createBullConnectionConfig = (configService: ConfigService) => {
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
};
