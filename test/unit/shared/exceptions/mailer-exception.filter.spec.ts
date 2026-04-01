import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { FoodaExceptionFilter } from 'src/contexts/shared/domain/exceptions/mailer-exception.filter';
import { FoodaException } from 'src/contexts/shared/domain/exceptions/mailer.exception';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';

describe('FoodaExceptionFilter', () => {
  const buildContext = () => {
    const response: any = {
      statusCode: 200,
      status: jest.fn(function status(this: any, code: number) {
        this.statusCode = code;
        return this;
      }),
      json: jest.fn(),
    };

    const host: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    } as unknown as ArgumentsHost;

    return { host, response };
  };

  it('handles FoodaException preserving status and body', () => {
    const { host, response } = buildContext();
    const filter = new FoodaExceptionFilter();
    const exception = new FoodaException(
      FoodaExceptionCodes.Ex1000,
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, host);

    expect(response.errorCode).toBe(FoodaExceptionCodes.Ex1000.code);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: FoodaExceptionCodes.Ex1000.code }),
    );
  });

  it('maps NotFoundException to Ex0001', () => {
    const { host, response } = buildContext();
    const filter = new FoodaExceptionFilter();

    filter.catch(new NotFoundException(), host);

    expect(response.errorCode).toBe(FoodaExceptionCodes.Ex0001.code);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: FoodaExceptionCodes.Ex0001.code }),
    );
  });

  it('maps HttpException with string message to Ex0000 preserving message', () => {
    const { host, response } = buildContext();
    const filter = new FoodaExceptionFilter();

    filter.catch(new HttpException('forbidden', HttpStatus.FORBIDDEN), host);

    expect(response.errorCode).toBe(FoodaExceptionCodes.Ex0000.code);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'forbidden',
        code: FoodaExceptionCodes.Ex0000.code,
      }),
    );
  });

  it('maps HttpException with array message by joining entries', () => {
    const { host, response } = buildContext();
    const filter = new FoodaExceptionFilter();

    filter.catch(
      new HttpException({ message: ['a', 'b'] }, HttpStatus.BAD_REQUEST),
      host,
    );

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'a, b' }),
    );
  });

  it('maps unknown errors to Ex9999', () => {
    const { host, response } = buildContext();
    const filter = new FoodaExceptionFilter();

    filter.catch(new Error('unexpected'), host);

    expect(response.errorCode).toBe(FoodaExceptionCodes.Ex9999.code);
    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
