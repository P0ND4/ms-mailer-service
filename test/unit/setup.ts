import { Logger } from '@nestjs/common';

beforeAll(() => {
  Logger.overrideLogger(false);
});

afterAll(() => {
  Logger.overrideLogger(['log', 'warn', 'error', 'debug', 'verbose']);
});
