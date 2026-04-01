import { RedisMailerRepository } from 'src/contexts/shared/infrastructure/repositories/mailer.repository';

describe('RedisMailerRepository', () => {
  const createRedisMock = () => ({
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue('482913'),
    del: jest.fn().mockResolvedValue(1),
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(1),
    ttl: jest.fn().mockResolvedValue(120),
  });

  it('saves and retrieves verification code with ttl', async () => {
    const redis = createRedisMock();
    const repository = new RedisMailerRepository(redis as any);

    await repository.saveVerificationCode('user:login:sms', '482913', 300);
    const code = await repository.getVerificationCode('user:login:sms');

    expect(redis.set).toHaveBeenCalledWith(
      'verification:code:user:login:sms',
      '482913',
      'EX',
      300,
    );
    expect(code).toBe('482913');
  });

  it('deletes verification code', async () => {
    const redis = createRedisMock();
    const repository = new RedisMailerRepository(redis as any);

    await repository.deleteVerificationCode('user:login:sms');

    expect(redis.del).toHaveBeenCalledWith('verification:code:user:login:sms');
  });

  it('returns ttl when verification code key has positive ttl', async () => {
    const redis = createRedisMock();
    redis.ttl.mockResolvedValue(45);
    const repository = new RedisMailerRepository(redis as any);

    const ttl = await repository.getVerificationCodeTtl('user:login:sms');

    expect(ttl).toBe(45);
  });

  it('returns null ttl when key has no expiration', async () => {
    const redis = createRedisMock();
    redis.ttl.mockResolvedValue(-1);
    const repository = new RedisMailerRepository(redis as any);

    const ttl = await repository.getVerificationCodeTtl('user:login:sms');

    expect(ttl).toBeNull();
  });

  it('increments attempts and sets expiry on first attempt', async () => {
    const redis = createRedisMock();
    redis.incr.mockResolvedValue(1);
    const repository = new RedisMailerRepository(redis as any);

    const attempts = await repository.incrementValidationAttempts(
      'user:login:sms',
      600,
    );

    expect(attempts).toBe(1);
    expect(redis.expire).toHaveBeenCalledWith(
      'verification:code:attempts:user:login:sms',
      600,
    );
  });

  it('increments generation requests and does not reset expiry after first request', async () => {
    const redis = createRedisMock();
    redis.incr.mockResolvedValueOnce(1).mockResolvedValueOnce(2);
    const repository = new RedisMailerRepository(redis as any);

    await repository.incrementGenerationRequests('user:login:sms', 60);
    await repository.incrementGenerationRequests('user:login:sms', 60);

    expect(redis.expire).toHaveBeenCalledTimes(1);
    expect(redis.expire).toHaveBeenCalledWith(
      'verification:code:rate:user:login:sms',
      60,
    );
  });

  it('reads and resets validation attempts', async () => {
    const redis = createRedisMock();
    redis.get.mockResolvedValue('3');
    const repository = new RedisMailerRepository(redis as any);

    const attempts = await repository.getValidationAttempts('user:login:sms');
    await repository.resetValidationAttempts('user:login:sms');

    expect(attempts).toBe(3);
    expect(redis.del).toHaveBeenCalledWith(
      'verification:code:attempts:user:login:sms',
    );
  });
});
