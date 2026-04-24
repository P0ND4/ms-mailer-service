import { CodeController } from 'src/contexts/mailer/infrastructure/http-api/v1/mailer/controllers/code.controller';

describe('CodeController', () => {
  const codeService = {
    generateCode: jest.fn(),
    validateCode: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates code with explicit ttl', async () => {
    codeService.generateCode.mockResolvedValueOnce('482913');
    const controller = new CodeController(codeService as any);

    const response = await controller.generateCode('tenant_abc', {
      hash: 'user1:login:sms:tenant1',
      length: 6,
      ttlSeconds: 120,
    });

    expect(codeService.generateCode).toHaveBeenCalledWith(
      'tenant_abc',
      6,
      'user1:login:sms:tenant1',
      120,
    );
    expect(response).toEqual({
      hash: 'user1:login:sms:tenant1',
      code: '482913',
      length: 6,
      ttlSeconds: 120,
    });
  });

  it('generates code with default ttl when missing', async () => {
    codeService.generateCode.mockResolvedValueOnce('9999');
    const controller = new CodeController(codeService as any);

    const response = await controller.generateCode('tenant_abc', {
      hash: 'user1:login:sms',
      length: 4,
    });

    expect(codeService.generateCode).toHaveBeenCalledWith(
      'tenant_abc',
      4,
      'user1:login:sms',
      300,
    );
    expect(response.ttlSeconds).toBe(300);
  });

  it('validates code and returns boolean status', async () => {
    codeService.validateCode.mockResolvedValueOnce(true);
    const controller = new CodeController(codeService as any);

    const response = await controller.validateCode('tenant_abc', {
      code: '482913',
      hash: 'user1:login:sms:tenant1',
    });

    expect(codeService.validateCode).toHaveBeenCalledWith(
      'tenant_abc',
      '482913',
      'user1:login:sms:tenant1',
    );
    expect(response).toEqual({ valid: true });
  });
});
