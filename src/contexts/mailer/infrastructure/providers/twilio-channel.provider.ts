import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Twilio, { type Twilio as TwilioClient } from 'twilio';
import {
  type SendBulkPhoneJobData,
  type SendPhoneJobData,
} from 'src/contexts/mailer/domain/types/delivery-options.type';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';
import { FoodaException } from 'src/contexts/shared/domain/exceptions/mailer.exception';

@Injectable()
export class TwilioChannelProvider {
  private readonly logger = new Logger(TwilioChannelProvider.name);
  private client?: TwilioClient;

  constructor(private readonly configService: ConfigService) {}

  async sendSMS(payload: SendPhoneJobData): Promise<void> {
    const messagingServiceSid =
      payload.options?.messagingServiceSid ?? this.getMessagingServiceSid();
    const from = payload.options?.from ?? this.getSmsFromNumber();
    const statusCallback =
      payload.options?.statusCallback ??
      this.getConfigValue('TWILIO_STATUS_CALLBACK');

    if (!from && !messagingServiceSid) {
      throw new FoodaException(
        FoodaExceptionCodes.Ex2004,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const client = this.getClient();

    try {
      const message = await client.messages.create({
        to: payload.to,
        body: payload.message,
        from,
        messagingServiceSid,
        statusCallback,
      });

      this.logger.log(`SMS delivered. to=${payload.to} sid=${message.sid}`);
    } catch (error) {
      this.logger.error(`SMS delivery failed. to=${payload.to}`, error);
      throw new FoodaException(
        FoodaExceptionCodes.Ex2005,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async sendBulkSMS(payload: SendBulkPhoneJobData): Promise<void> {
    await Promise.all(
      payload.recipients.map((recipient) =>
        this.sendSMS({
          to: recipient,
          message: payload.message,
          options: payload.options,
        }),
      ),
    );
  }

  async sendWhatsApp(payload: SendPhoneJobData): Promise<void> {
    const messagingServiceSid =
      payload.options?.messagingServiceSid ?? this.getMessagingServiceSid();
    const fromBase = payload.options?.from ?? this.getWhatsAppFromNumber();
    const from = fromBase ? this.toWhatsAppAddress(fromBase) : undefined;
    const statusCallback =
      payload.options?.statusCallback ??
      this.getConfigValue('TWILIO_STATUS_CALLBACK');

    if (!from && !messagingServiceSid) {
      throw new FoodaException(
        FoodaExceptionCodes.Ex2004,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const client = this.getClient();

    try {
      const message = await client.messages.create({
        to: this.toWhatsAppAddress(payload.to),
        body: payload.message,
        from,
        messagingServiceSid,
        statusCallback,
      });

      this.logger.log(
        `WhatsApp delivered. to=${payload.to} sid=${message.sid}`,
      );
    } catch (error) {
      this.logger.error(`WhatsApp delivery failed. to=${payload.to}`, error);
      throw new FoodaException(
        FoodaExceptionCodes.Ex2005,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async sendBulkWhatsApp(payload: SendBulkPhoneJobData): Promise<void> {
    await Promise.all(
      payload.recipients.map((recipient) =>
        this.sendWhatsApp({
          to: recipient,
          message: payload.message,
          options: payload.options,
        }),
      ),
    );
  }

  async sendVoiceCall(payload: SendPhoneJobData): Promise<void> {
    const from = payload.options?.from ?? this.getVoiceFromNumber();
    if (!from) {
      throw new FoodaException(
        FoodaExceptionCodes.Ex2004,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const statusCallback =
      payload.options?.statusCallback ??
      this.getConfigValue('TWILIO_VOICE_STATUS_CALLBACK') ??
      this.getConfigValue('TWILIO_STATUS_CALLBACK');

    const voiceUrl =
      payload.options?.voiceUrl ?? this.getConfigValue('TWILIO_VOICE_URL');

    const client = this.getClient();

    try {
      const call = await client.calls.create({
        to: payload.to,
        from,
        statusCallback,
        ...(voiceUrl
          ? { url: voiceUrl }
          : {
              twiml:
                payload.options?.twiml ??
                this.buildDefaultVoiceTwiml(payload.message),
            }),
      });

      this.logger.log(`Voice call delivered. to=${payload.to} sid=${call.sid}`);
    } catch (error) {
      this.logger.error(`Voice call delivery failed. to=${payload.to}`, error);
      throw new FoodaException(
        FoodaExceptionCodes.Ex2005,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async sendBulkVoiceCall(payload: SendBulkPhoneJobData): Promise<void> {
    await Promise.all(
      payload.recipients.map((recipient) =>
        this.sendVoiceCall({
          to: recipient,
          message: payload.message,
          options: payload.options,
        }),
      ),
    );
  }

  private getMessagingServiceSid(): string | undefined {
    return (
      this.getConfigValue('TWILIO_MESSAGING_SERVICE_SID') ??
      this.getConfigValue('TWILIO_SERVICE_SID')
    );
  }

  private getSmsFromNumber(): string | undefined {
    return (
      this.getConfigValue('TWILIO_SMS_FROM') ??
      this.getConfigValue('TWILIO_PHONE_NUMBER')
    );
  }

  private getWhatsAppFromNumber(): string | undefined {
    return (
      this.getConfigValue('TWILIO_WHATSAPP_FROM') ??
      this.getConfigValue('TWILIO_PHONE_NUMBER')
    );
  }

  private getVoiceFromNumber(): string | undefined {
    return (
      this.getConfigValue('TWILIO_VOICE_FROM') ??
      this.getConfigValue('TWILIO_PHONE_NUMBER')
    );
  }

  private toWhatsAppAddress(value: string): string {
    return value.startsWith('whatsapp:') ? value : `whatsapp:${value}`;
  }

  private buildDefaultVoiceTwiml(message: string): string {
    return `<Response><Say language="es-ES">${this.escapeXml(message)}</Say></Response>`;
  }

  private escapeXml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');
  }

  private getClient(): TwilioClient {
    if (this.client) {
      return this.client;
    }

    const accountSid = this.getConfigValue('TWILIO_ACCOUNT_SID');
    const authToken = this.getConfigValue('TWILIO_AUTH_TOKEN');

    if (!accountSid || !authToken) {
      throw new FoodaException(
        FoodaExceptionCodes.Ex2003,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.client = Twilio(accountSid, authToken);
    return this.client;
  }

  private getConfigValue(key: string): string | undefined {
    const value = this.configService.get<string>(key)?.trim();
    return value || undefined;
  }
}
