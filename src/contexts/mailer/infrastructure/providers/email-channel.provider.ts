import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type SendMailOptions, type Transporter } from 'nodemailer';
import {
  type SendBulkEmailJobData,
  type SendEmailJobData,
} from 'src/contexts/mailer/domain/types/delivery-options.type';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';
import { FoodaException } from 'src/contexts/shared/domain/exceptions/mailer.exception';

@Injectable()
export class EmailChannelProvider {
  private readonly logger = new Logger(EmailChannelProvider.name);
  private transporter?: Transporter;

  constructor(private readonly configService: ConfigService) {}

  async send(payload: SendEmailJobData): Promise<void> {
    const from = payload.options?.from ?? this.getDefaultFromAddress();
    if (!from) {
      throw new FoodaException(
        FoodaExceptionCodes.Ex2001,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const mailOptions: SendMailOptions = {
      to: payload.to,
      subject: payload.subject,
      from,
      replyTo: payload.options?.replyTo,
      cc: payload.options?.cc,
      bcc: payload.options?.bcc,
      headers: payload.options?.headers,
      html: payload.options?.html ?? payload.body,
      text: payload.options?.text ?? payload.body,
    };

    try {
      const info = await this.getTransporter().sendMail(mailOptions);
      this.logger.log(
        `Email delivered. to=${payload.to} messageId=${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(`Email delivery failed. to=${payload.to}`, error);
      throw new FoodaException(
        FoodaExceptionCodes.Ex2002,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async sendBulk(payload: SendBulkEmailJobData): Promise<void> {
    if (payload.recipients.length === 0) return;

    if (payload.options?.sendAsBcc) {
      const from = payload.options.from ?? this.getDefaultFromAddress();
      if (!from) {
        throw new FoodaException(
          FoodaExceptionCodes.Ex2001,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await this.send({
        to: from,
        subject: payload.subject,
        body: payload.body,
        options: {
          ...payload.options,
          bcc: [...(payload.options.bcc ?? []), ...payload.recipients],
        },
      });
      return;
    }

    await Promise.all(
      payload.recipients.map((recipient) =>
        this.send({
          to: recipient,
          subject: payload.subject,
          body: payload.body,
          options: payload.options,
        }),
      ),
    );
  }

  private getTransporter(): Transporter {
    if (this.transporter) return this.transporter;

    const host = this.getConfigValue('MAIL_HOST');
    if (!host) {
      throw new FoodaException(
        FoodaExceptionCodes.Ex2000,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const rawPort = this.configService.get<number | string>('MAIL_PORT');
    const port =
      typeof rawPort === 'number'
        ? rawPort
        : Number.parseInt(String(rawPort ?? '465'), 10);

    const secure = this.parseBoolean(
      this.configService.get<boolean | string>('MAIL_SECURE'),
      port === 465,
    );

    const user = this.getConfigValue('MAIL_USER');
    const pass = this.getConfigValue('MAIL_PASSWORD');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });

    return this.transporter;
  }

  private getDefaultFromAddress(): string | undefined {
    return this.getConfigValue('MAIL_FROM') ?? this.getConfigValue('MAIL_USER');
  }

  private getConfigValue(key: string): string | undefined {
    const value = this.configService.get<string>(key);
    const normalized = value?.trim();
    return normalized ? normalized : undefined;
  }

  private parseBoolean(value: boolean | string | undefined, fallback: boolean) {
    if (typeof value === 'boolean') return value;
    if (typeof value !== 'string') return fallback;

    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1';
  }
}
