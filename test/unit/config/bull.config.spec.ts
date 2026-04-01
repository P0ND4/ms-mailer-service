import { createBullConnectionConfig } from 'src/config/bull.config';

describe('bull.config', () => {
  it('uses REDIS_URL when provided', () => {
    const configService = {
      get: jest.fn((key: string) =>
        key === 'REDIS_URL'
          ? 'redis://user:pass@redis.local:6380/4'
          : undefined,
      ),
    } as any;

    const result = createBullConnectionConfig(configService);

    expect(result).toEqual({
      connection: {
        host: 'redis.local',
        port: 6380,
        username: 'user',
        password: 'pass',
        db: 4,
      },
    });
  });

  it('uses host/port config when REDIS_URL is absent', () => {
    const values: Record<string, unknown> = {
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
      REDIS_USERNAME: 'cache-user',
      REDIS_PASSWORD: 'cache-pass',
    };
    const configService = {
      get: jest.fn((key: string) => values[key]),
    } as any;

    const result = createBullConnectionConfig(configService);

    expect(result).toEqual({
      connection: {
        host: 'localhost',
        port: 6379,
        username: 'cache-user',
        password: 'cache-pass',
      },
    });
  });
});
