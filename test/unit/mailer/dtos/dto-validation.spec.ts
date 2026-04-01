import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GenerateCodeDto } from 'src/contexts/mailer/infrastructure/http-api/v1/mailer/dtos/generate-code.dto';
import { SendBulkEmailDto } from 'src/contexts/mailer/infrastructure/http-api/v1/mailer/dtos/send-bulk-email.dto';
import { SendBulkPhoneMessageDto } from 'src/contexts/mailer/infrastructure/http-api/v1/mailer/dtos/send-bulk-phone-message.dto';
import { SendEmailDto } from 'src/contexts/mailer/infrastructure/http-api/v1/mailer/dtos/send-email.dto';
import { SendPhoneMessageDto } from 'src/contexts/mailer/infrastructure/http-api/v1/mailer/dtos/send-phone-message.dto';
import { ValidateCodeDto } from 'src/contexts/mailer/infrastructure/http-api/v1/mailer/dtos/validate-code.dto';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';

describe('Mailer DTO validation', () => {
  const extractMessages = (errors: any[]): string[] => {
    const messages: string[] = [];
    for (const error of errors) {
      if (error.constraints) {
        messages.push(...Object.values(error.constraints));
      }
      if (error.children?.length) {
        messages.push(...extractMessages(error.children));
      }
    }
    return messages;
  };

  it('accepts a valid generate code payload', async () => {
    const dto = plainToInstance(GenerateCodeDto, {
      hash: 'user1:login:sms:tenant1',
      length: 6,
      ttlSeconds: 120,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid contextual hash for generate code', async () => {
    const dto = plainToInstance(GenerateCodeDto, {
      hash: 'invalid-hash',
      length: 6,
    });

    const errors = await validate(dto);
    expect(extractMessages(errors)).toContain(
      FoodaExceptionCodes.Ex1028.message,
    );
  });

  it('rejects invalid contextual hash for validate code', async () => {
    const dto = plainToInstance(ValidateCodeDto, {
      code: '1234',
      hash: 'bad',
    });

    const errors = await validate(dto);
    expect(extractMessages(errors)).toContain(
      FoodaExceptionCodes.Ex1028.message,
    );
  });

  it('rejects duplicate recipients in bulk email payload', async () => {
    const dto = plainToInstance(SendBulkEmailDto, {
      recipients: ['a@company.com', 'a@company.com'],
      subject: 'S',
      body: 'B',
    });

    const errors = await validate(dto);
    expect(extractMessages(errors)).toContain(
      FoodaExceptionCodes.Ex1021.message,
    );
  });

  it('rejects invalid phone format in single phone payload', async () => {
    const dto = plainToInstance(SendPhoneMessageDto, {
      to: '12345',
      message: 'Hi',
    });

    const errors = await validate(dto);
    expect(extractMessages(errors)).toContain(
      FoodaExceptionCodes.Ex1022.message,
    );
  });

  it('rejects invalid phone format in bulk phone payload', async () => {
    const dto = plainToInstance(SendBulkPhoneMessageDto, {
      recipients: ['+51999888777', '12345'],
      message: 'Hi',
    });

    const errors = await validate(dto);
    expect(extractMessages(errors)).toContain(
      FoodaExceptionCodes.Ex1023.message,
    );
  });

  it('rejects non-object options in email dto', async () => {
    const dto = plainToInstance(SendEmailDto, {
      to: 'a@company.com',
      subject: 'S',
      body: 'B',
      options: 'invalid',
    });

    const errors = await validate(dto);
    expect(extractMessages(errors)).toContain(
      FoodaExceptionCodes.Ex1027.message,
    );
  });
});
