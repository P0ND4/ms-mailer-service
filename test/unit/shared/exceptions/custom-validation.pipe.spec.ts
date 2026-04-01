import { BadRequestException, ValidationError } from '@nestjs/common';
import { CustomValidationPipe } from 'src/contexts/shared/domain/exceptions/custom-validation.pipe';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';
import { FoodaException } from 'src/contexts/shared/domain/exceptions/mailer.exception';

describe('CustomValidationPipe', () => {
  const getFactory = (pipe: CustomValidationPipe) =>
    (pipe as any).exceptionFactory as (errors: ValidationError[]) => Error;

  const makeError = (message: string): ValidationError =>
    ({ constraints: { isString: message } }) as ValidationError;

  it('returns BadRequestException when there are no messages', () => {
    const pipe = new CustomValidationPipe();
    const factory = getFactory(pipe);

    const exception = factory([{} as ValidationError]);

    expect(exception).toBeInstanceOf(BadRequestException);
  });

  it('maps exact message to FoodaException code', () => {
    const pipe = new CustomValidationPipe();
    const factory = getFactory(pipe);

    const exception = factory([makeError(FoodaExceptionCodes.Ex1000.message)]);

    expect(exception).toBeInstanceOf(FoodaException);
    expect((exception as FoodaException).code).toBe(
      FoodaExceptionCodes.Ex1000.code,
    );
  });

  it('maps code key message to FoodaException code', () => {
    const pipe = new CustomValidationPipe();
    const factory = getFactory(pipe);

    const exception = factory([makeError('Ex1001')]);

    expect(exception).toBeInstanceOf(FoodaException);
    expect((exception as FoodaException).code).toBe(
      FoodaExceptionCodes.Ex1001.code,
    );
  });

  it('returns BadRequestException with original message when unknown', () => {
    const pipe = new CustomValidationPipe();
    const factory = getFactory(pipe);

    const exception = factory([
      makeError('custom error'),
    ]) as BadRequestException;

    expect(exception).toBeInstanceOf(BadRequestException);
    expect(exception.getResponse()).toEqual(
      expect.objectContaining({ message: ['custom error'] }),
    );
  });

  it('collects messages recursively from child validation errors', () => {
    const pipe = new CustomValidationPipe();
    const factory = getFactory(pipe);

    const nestedError = {
      children: [
        {
          constraints: {
            matches: FoodaExceptionCodes.Ex1028.message,
          },
        },
      ],
    } as ValidationError;

    const exception = factory([nestedError]);

    expect(exception).toBeInstanceOf(FoodaException);
    expect((exception as FoodaException).code).toBe(
      FoodaExceptionCodes.Ex1028.code,
    );
  });
});
