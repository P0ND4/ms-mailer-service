interface Environment {
  REDIS_URL?: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string;
  REDIS_USERNAME?: string;

  MAIL_HOST?: string;
  MAIL_PORT: number;
  MAIL_SECURE: boolean;
  MAIL_USER?: string;
  MAIL_PASSWORD?: string;
  MAIL_FROM?: string;

  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_SERVICE_SID?: string;
  TWILIO_MESSAGING_SERVICE_SID?: string;
  TWILIO_PHONE_NUMBER?: string;
  TWILIO_SMS_FROM?: string;
  TWILIO_WHATSAPP_FROM?: string;
  TWILIO_VOICE_FROM?: string;
  TWILIO_STATUS_CALLBACK?: string;
  TWILIO_VOICE_STATUS_CALLBACK?: string;
  TWILIO_VOICE_URL?: string;

  OTP_MAX_VALIDATE_ATTEMPTS: number;
  OTP_VALIDATE_ATTEMPTS_TTL_SECONDS: number;
  OTP_GENERATE_RATE_LIMIT_MAX_REQUESTS: number;
  OTP_GENERATE_RATE_LIMIT_WINDOW_SECONDS: number;

  PORT: number;
  NODE_ENV: string;
}

const parseBoolean = (
  value: string | undefined,
  defaultValue: boolean,
): boolean => {
  if (value === undefined) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === '1';
};

export default async (): Promise<Environment> => {
  // Here you can use the ms-config-service and change the environment.
  // Compatible with async await by default.
  // If you're going to use asynchronous requests for environment variables, remember to use caching or ms-cache-service.

  return {
    // Redis
    REDIS_URL: process.env.REDIS_URL,
    REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
    REDIS_PORT: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_USERNAME: process.env.REDIS_USERNAME,

    // Mailer
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: parseInt(process.env.MAIL_PORT ?? '465', 10),
    MAIL_SECURE: parseBoolean(process.env.MAIL_SECURE, true),
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_FROM: process.env.MAIL_FROM,

    // Twilio
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_SERVICE_SID: process.env.TWILIO_SERVICE_SID,
    TWILIO_MESSAGING_SERVICE_SID: process.env.TWILIO_MESSAGING_SERVICE_SID,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    TWILIO_SMS_FROM: process.env.TWILIO_SMS_FROM,
    TWILIO_WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_FROM,
    TWILIO_VOICE_FROM: process.env.TWILIO_VOICE_FROM,
    TWILIO_STATUS_CALLBACK: process.env.TWILIO_STATUS_CALLBACK,
    TWILIO_VOICE_STATUS_CALLBACK: process.env.TWILIO_VOICE_STATUS_CALLBACK,
    TWILIO_VOICE_URL: process.env.TWILIO_VOICE_URL,

    // OTP Security
    OTP_MAX_VALIDATE_ATTEMPTS: parseInt(
      process.env.OTP_MAX_VALIDATE_ATTEMPTS ?? '5',
      10,
    ),
    OTP_VALIDATE_ATTEMPTS_TTL_SECONDS: parseInt(
      process.env.OTP_VALIDATE_ATTEMPTS_TTL_SECONDS ?? '900',
      10,
    ),
    OTP_GENERATE_RATE_LIMIT_MAX_REQUESTS: parseInt(
      process.env.OTP_GENERATE_RATE_LIMIT_MAX_REQUESTS ?? '3',
      10,
    ),
    OTP_GENERATE_RATE_LIMIT_WINDOW_SECONDS: parseInt(
      process.env.OTP_GENERATE_RATE_LIMIT_WINDOW_SECONDS ?? '60',
      10,
    ),

    // Server
    PORT: parseInt(process.env.PORT ?? '3000', 10),
    NODE_ENV: process.env.NODE_ENV ?? 'development',
  };
};
