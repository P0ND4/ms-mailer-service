import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { V1_MAILER } from '../../../route.constants';
import { IPhoneUseCase } from 'src/contexts/mailer/domain/use-cases/mailer/phone.use-case.interface';
import { SendPhoneMessageDto } from '../dtos/send-phone-message.dto';
import { SendBulkPhoneMessageDto } from '../dtos/send-bulk-phone-message.dto';

@ApiTags('Mailer Phone')
@Controller(`${V1_MAILER}/phone`)
export class PhoneController {
  constructor(private readonly phoneUseCase: IPhoneUseCase) {}

  @Post('sms/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar SMS individual',
    description:
      'Envia un mensaje SMS a un unico destinatario en formato telefonico internacional.',
  })
  @ApiBody({
    type: SendPhoneMessageDto,
    description: 'Datos del destinatario y contenido del SMS.',
    examples: {
      otp: {
        summary: 'Envio OTP por SMS',
        value: {
          to: '+51999888777',
          message: 'Tu codigo de verificacion es 482913',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'SMS enviado correctamente.' })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1009, ML-1010, ML-1011, ML-1012, ML-1022.',
  })
  async sendSMS(@Body() body: SendPhoneMessageDto) {
    await this.phoneUseCase.sendSMS(body.to, body.message);
    return {
      sent: true,
      channel: 'phone',
      type: 'sms-single',
      recipient: body.to,
    };
  }

  @Post('sms/send/bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar SMS masivo',
    description:
      'Envia un mismo SMS a multiples destinatarios en una unica solicitud.',
  })
  @ApiBody({
    type: SendBulkPhoneMessageDto,
    description:
      'Listado de numeros destino en E.164 y mensaje compartido para todos.',
  })
  @ApiOkResponse({ description: 'SMS masivo enviado correctamente.' })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1006, ML-1007, ML-1011, ML-1012, ML-1013, ML-1021, ML-1023.',
  })
  async sendBulkSMS(@Body() body: SendBulkPhoneMessageDto) {
    await this.phoneUseCase.sendBulkSMS(body.recipients, body.message);
    return {
      sent: true,
      channel: 'phone',
      type: 'sms-bulk',
      recipientsCount: body.recipients.length,
    };
  }

  @Post('whatsapp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar WhatsApp individual',
    description:
      'Envia un mensaje de WhatsApp a un unico destinatario usando formato de numero internacional.',
  })
  @ApiBody({
    type: SendPhoneMessageDto,
    description: 'Datos del destinatario y contenido del mensaje de WhatsApp.',
  })
  @ApiOkResponse({ description: 'Mensaje de WhatsApp enviado correctamente.' })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1009, ML-1010, ML-1011, ML-1012, ML-1022.',
  })
  async sendWhatsApp(@Body() body: SendPhoneMessageDto) {
    await this.phoneUseCase.sendWhatsApp(body.to, body.message);
    return {
      sent: true,
      channel: 'phone',
      type: 'whatsapp-single',
      recipient: body.to,
    };
  }

  @Post('whatsapp/send/bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar WhatsApp masivo',
    description:
      'Envia el mismo mensaje de WhatsApp a multiples destinatarios en una sola operacion.',
  })
  @ApiBody({
    type: SendBulkPhoneMessageDto,
    description:
      'Listado de numeros destino en E.164 y mensaje compartido para todos.',
  })
  @ApiOkResponse({ description: 'WhatsApp masivo enviado correctamente.' })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1006, ML-1007, ML-1011, ML-1012, ML-1013, ML-1021, ML-1023.',
  })
  async sendBulkWhatsApp(@Body() body: SendBulkPhoneMessageDto) {
    await this.phoneUseCase.sendBulkWhatsApp(body.recipients, body.message);
    return {
      sent: true,
      channel: 'phone',
      type: 'whatsapp-bulk',
      recipientsCount: body.recipients.length,
    };
  }

  @Post('voice-call/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar llamada de voz individual',
    description:
      'Inicia una llamada de voz a un destinatario y reproduce el mensaje proporcionado.',
  })
  @ApiBody({
    type: SendPhoneMessageDto,
    description:
      'Datos del destinatario y mensaje que sera reproducido durante la llamada.',
  })
  @ApiOkResponse({ description: 'Llamada de voz enviada correctamente.' })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1009, ML-1010, ML-1011, ML-1012, ML-1022.',
  })
  async sendVoiceCall(@Body() body: SendPhoneMessageDto) {
    await this.phoneUseCase.sendVoiceCall(body.to, body.message);
    return {
      sent: true,
      channel: 'phone',
      type: 'voice-call-single',
      recipient: body.to,
    };
  }

  @Post('voice-call/send/bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar llamada de voz masiva',
    description:
      'Inicia llamadas de voz masivas y reproduce el mismo mensaje para todos los destinatarios.',
  })
  @ApiBody({
    type: SendBulkPhoneMessageDto,
    description:
      'Listado de numeros destino en E.164 y mensaje compartido para todos.',
  })
  @ApiOkResponse({
    description: 'Llamadas de voz masivas enviadas correctamente.',
  })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1006, ML-1007, ML-1011, ML-1012, ML-1013, ML-1021, ML-1023.',
  })
  async sendBulkVoiceCall(@Body() body: SendBulkPhoneMessageDto) {
    await this.phoneUseCase.sendBulkVoiceCall(body.recipients, body.message);
    return {
      sent: true,
      channel: 'phone',
      type: 'voice-call-bulk',
      recipientsCount: body.recipients.length,
    };
  }
}
