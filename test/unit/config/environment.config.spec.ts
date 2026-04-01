import environment from 'src/config/environment.config';

describe('environment.config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('loads and parses environment variables with defaults', async () => {
    process.env.REDIS_HOST = 'redis-host';
    process.env.REDIS_PORT = '6381';
    process.env.MAIL_SECURE = 'false';
    process.env.OTP_MAX_VALIDATE_ATTEMPTS = '7';
    process.env.OTP_VALIDATE_ATTEMPTS_TTL_SECONDS = '1200';
    process.env.OTP_GENERATE_RATE_LIMIT_MAX_REQUESTS = '9';
    process.env.OTP_GENERATE_RATE_LIMIT_WINDOW_SECONDS = '90';

    const result = await environment();

    expect(result.REDIS_HOST).toBe('redis-host');
    expect(result.REDIS_PORT).toBe(6381);
    expect(result.MAIL_SECURE).toBe(false);
    expect(result.OTP_MAX_VALIDATE_ATTEMPTS).toBe(7);
    expect(result.OTP_VALIDATE_ATTEMPTS_TTL_SECONDS).toBe(1200);
    expect(result.OTP_GENERATE_RATE_LIMIT_MAX_REQUESTS).toBe(9);
    expect(result.OTP_GENERATE_RATE_LIMIT_WINDOW_SECONDS).toBe(90);
  });

  it('falls back to default values when env vars are missing', async () => {
    delete process.env.REDIS_PORT;
    delete process.env.PORT;
    delete process.env.MAIL_SECURE;
    delete process.env.OTP_MAX_VALIDATE_ATTEMPTS;

    const result = await environment();

    expect(result.REDIS_PORT).toBe(6379);
    expect(result.PORT).toBe(3000);
    expect(result.MAIL_SECURE).toBe(true);
    expect(result.OTP_MAX_VALIDATE_ATTEMPTS).toBe(5);
  });
});
