import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { V1_MAILER } from '../../../route.constants';
import { IEmailUseCase } from 'src/contexts/mailer/domain/use-cases/mailer/email.use-case.interface';
import { SendEmailDto } from '../dtos/send-email.dto';
import { SendBulkEmailDto } from '../dtos/send-bulk-email.dto';

@ApiTags('Mailer Email')
@Controller(`${V1_MAILER}/email`)
export class EmailController {
  constructor(private readonly emailService: IEmailUseCase) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar correo individual',
    description:
      'Envia un correo electronico a un unico destinatario con asunto y cuerpo definidos por el cliente.',
  })
  @ApiBody({
    type: SendEmailDto,
    description:
      'Payload para envio individual. El campo `to` debe ser un correo valido.',
    examples: {
      confirmacionCompra: {
        summary: 'Correo de confirmacion de compra',
        value: {
          to: 'cliente@empresa.com',
          subject: 'Confirmacion de compra #9812',
          body: 'Tu pedido fue procesado correctamente. Gracias por tu compra.',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Correo enviado correctamente.',
  })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1000, ML-1001, ML-1002, ML-1003, ML-1004, ML-1005.',
  })
  async sendEmail(@Body() body: SendEmailDto) {
    await this.emailService.sendEmail(body.to, body.subject, body.body);

    return {
      sent: true,
      channel: 'email',
      type: 'single',
      recipient: body.to,
    };
  }

  @Post('send/bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar correo masivo',
    description:
      'Envia un mismo correo a multiples destinatarios en una sola operacion.',
  })
  @ApiBody({
    type: SendBulkEmailDto,
    description:
      'Payload para envio masivo. `recipients` debe contener correos validos y sin duplicados.',
    examples: {
      mantenimientoProgramado: {
        summary: 'Notificacion de mantenimiento',
        value: {
          recipients: ['user1@empresa.com', 'user2@empresa.com'],
          subject: 'Mantenimiento programado',
          body: 'Este domingo entre 02:00 y 03:00 UTC realizaremos mantenimiento preventivo.',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Correo masivo enviado correctamente.',
  })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1002, ML-1003, ML-1004, ML-1005, ML-1006, ML-1007, ML-1008, ML-1013, ML-1021.',
  })
  async sendBulkEmail(@Body() body: SendBulkEmailDto) {
    await this.emailService.sendBulkEmail(
      body.recipients,
      body.subject,
      body.body,
    );

    return {
      sent: true,
      channel: 'email',
      type: 'bulk',
      recipientsCount: body.recipients.length,
    };
  }
}
