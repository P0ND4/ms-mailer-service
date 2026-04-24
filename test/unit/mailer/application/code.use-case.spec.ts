import { CodeUseCase } from 'src/contexts/mailer/application/mailer/code.use-case';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';
import { FoodaException } from 'src/contexts/shared/domain/exceptions/mailer.exception';

describe('CodeUseCase', () => {
  const hash = 'user123:login:sms:tenantA';
  const tenantId = 'tenant_abc';

  const createRepositoryMock = () => ({
    saveVerificationCode: jest.fn().mockResolvedValue(undefined),
    getVerificationCode: jest.fn().mockResolvedValue('123456'),
    getVerificationCodeTtl: jest.fn().mockResolvedValue(300),
    deleteVerificationCode: jest.fn().mockResolvedValue(undefined),
    getValidationAttempts: jest.fn().mockResolvedValue(0),
    incrementValidationAttempts: jest.fn().mockResolvedValue(1),
    resetValidationAttempts: jest.fn().mockResolvedValue(undefined),
    incrementGenerationRequests: jest.fn().mockResolvedValue(1),
  });

  const createConfigMock = (values: Record<string, unknown> = {}) => ({
    get: jest.fn((key: string) => values[key]),
  });

  it('generates numeric OTP with bounded length and saves it', async () => {
    const repository = createRepositoryMock();
    const configService = createConfigMock();
    const useCase = new CodeUseCase(repository as any, configService as any);

    const code = await useCase.generateCode(tenantId, 6, hash, 300);

    expect(code).toMatch(/^\d{6}$/);
    expect(repository.incrementGenerationRequests).toHaveBeenCalledWith(
      tenantId,
      hash,
      60,
    );
    expect(repository.saveVerificationCode).toHaveBeenCalledWith(
      tenantId,
      hash,
      code,
      300,
    );
    expect(repository.resetValidationAttempts).toHaveBeenCalledWith(tenantId, hash);
  });

  it('blocks generation when rate limit is exceeded', async () => {
    const repository = createRepositoryMock();
    repository.incrementGenerationRequests.mockResolvedValue(3);
    const configService = createConfigMock({
      OTP_GENERATE_RATE_LIMIT_MAX_REQUESTS: 2,
    });
    const useCase = new CodeUseCase(repository as any, configService as any);

    await expect(useCase.generateCode(tenantId, 6, hash, 300)).rejects.toMatchObject({
      code: FoodaExceptionCodes.Ex3001.code,
    } as FoodaException);
  });

  it('blocks validation immediately when attempts are already exhausted', async () => {
    const repository = createRepositoryMock();
    repository.getValidationAttempts.mockResolvedValue(5);
    const configService = createConfigMock({ OTP_MAX_VALIDATE_ATTEMPTS: 5 });
    const useCase = new CodeUseCase(repository as any, configService as any);

    await expect(useCase.validateCode(tenantId, '123456', hash)).rejects.toMatchObject({
      code: FoodaExceptionCodes.Ex3000.code,
    } as FoodaException);
    expect(repository.deleteVerificationCode).toHaveBeenCalledWith(tenantId, hash);
  });

  it('returns false for invalid code and increments attempts using OTP TTL', async () => {
    const repository = createRepositoryMock();
    repository.getVerificationCode.mockResolvedValue('999999');
    repository.getVerificationCodeTtl.mockResolvedValue(180);
    repository.incrementValidationAttempts.mockResolvedValue(2);
    const configService = createConfigMock();
    const useCase = new CodeUseCase(repository as any, configService as any);

    const result = await useCase.validateCode(tenantId, '111111', hash);

    expect(result).toBe(false);
    expect(repository.incrementValidationAttempts).toHaveBeenCalledWith(
      tenantId,
      hash,
      180,
    );
  });

  it('falls back to configured attempts TTL when OTP TTL is unavailable', async () => {
    const repository = createRepositoryMock();
    repository.getVerificationCode.mockResolvedValue('999999');
    repository.getVerificationCodeTtl.mockResolvedValue(null);
    const configService = createConfigMock({
      OTP_VALIDATE_ATTEMPTS_TTL_SECONDS: 777,
    });
    const useCase = new CodeUseCase(repository as any, configService as any);

    await useCase.validateCode(tenantId, '111111', hash);

    expect(repository.incrementValidationAttempts).toHaveBeenCalledWith(
      tenantId,
      hash,
      777,
    );
  });

  it('invalidates OTP and throws when attempts reach maximum on failure', async () => {
    const repository = createRepositoryMock();
    repository.getVerificationCode.mockResolvedValue('999999');
    repository.incrementValidationAttempts.mockResolvedValue(5);
    const configService = createConfigMock({ OTP_MAX_VALIDATE_ATTEMPTS: 5 });
    const useCase = new CodeUseCase(repository as any, configService as any);

    await expect(useCase.validateCode(tenantId, '111111', hash)).rejects.toMatchObject({
      code: FoodaExceptionCodes.Ex3000.code,
    } as FoodaException);
    expect(repository.deleteVerificationCode).toHaveBeenCalledWith(tenantId, hash);
  });

  it('returns true for valid code and clears code plus attempts', async () => {
    const repository = createRepositoryMock();
    repository.getVerificationCode.mockResolvedValue('482913');
    const configService = createConfigMock();
    const useCase = new CodeUseCase(repository as any, configService as any);

    const result = await useCase.validateCode(tenantId, '482913', hash);

    expect(result).toBe(true);
    expect(repository.deleteVerificationCode).toHaveBeenCalledWith(tenantId, hash);
    expect(repository.resetValidationAttempts).toHaveBeenCalledWith(tenantId, hash);
  });
});
