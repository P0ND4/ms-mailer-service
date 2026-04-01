import { HttpStatus } from '@nestjs/common';
import { FoodaException } from 'src/contexts/shared/domain/exceptions/mailer.exception';
import {
  FoodaExceptionCodes,
  FoodaExceptionInfo,
} from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';

describe('FoodaException', () => {
  it('builds expected response payload', () => {
    const error = new FoodaException(
      FoodaExceptionCodes.Ex1000,
      HttpStatus.BAD_REQUEST,
    );

    expect(error.code).toBe(FoodaExceptionCodes.Ex1000.code);
    expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    expect(error.getResponse()).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message: FoodaExceptionCodes.Ex1000.message,
      code: FoodaExceptionCodes.Ex1000.code,
      service: FoodaExceptionCodes.Ex1000.service,
    });
  });

  it('allows explicit service override in exception info', () => {
    const info = new FoodaExceptionInfo('X-1', 'Error', 'custom-service');

    expect(info.code).toBe('X-1');
    expect(info.message).toBe('Error');
    expect(info.service).toBe('custom-service');
  });
});
