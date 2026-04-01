import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, firstValueFrom } from 'rxjs';
import { ApiResponseInterceptor } from 'src/contexts/shared/interceptors/api.response.interceptor';

describe('ApiResponseInterceptor', () => {
  const createContext = (statusCode: number, statusMessage?: string) =>
    ({
      switchToHttp: () => ({
        getResponse: () => ({ statusCode, statusMessage }),
      }),
    }) as unknown as ExecutionContext;

  const createNext = (data: unknown) =>
    ({ handle: () => of(data) }) as CallHandler;

  it('wraps response with success defaults for 2xx responses', async () => {
    const interceptor = new ApiResponseInterceptor();

    const output = await firstValueFrom(
      interceptor.intercept(createContext(201), createNext({ id: 1 })),
    );

    expect(output).toEqual({
      success: true,
      data: { id: 1 },
      message: 'Request successful',
      statusCode: 201,
    });
  });

  it('uses response statusMessage when present', async () => {
    const interceptor = new ApiResponseInterceptor();

    const output = await firstValueFrom(
      interceptor.intercept(
        createContext(200, 'Everything OK'),
        createNext({ ok: true }),
      ),
    );

    expect(output.message).toBe('Everything OK');
  });

  it('uses failed default message for non-2xx status', async () => {
    const interceptor = new ApiResponseInterceptor();

    const output = await firstValueFrom(
      interceptor.intercept(createContext(500), createNext({ ok: false })),
    );

    expect(output.message).toBe('Request failed');
    expect(output.statusCode).toBe(500);
  });
});
