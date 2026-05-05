import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { V1_MAILER } from '../../../route.constants';
import { IEmailUseCase } from 'src/contexts/mailer/domain/use-cases/mailer/email.use-case.interface';
import { SendEmailDto } from '../dtos/send-email.dto';
import { SendBulkEmailDto } from '../dtos/send-bulk-email.dto';

@ApiTags('Mailer Email')
@ApiHeader({
  name: 'x-tenant-id',
  required: true,
  description: 'Identificador del tenant (schema de la base de datos)',
  example: 'tenant_abc',
})
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
      'Payload para envio individual. El campo `to` debe ser un correo valido y `options` es opcional para personalizacion avanzada.',
    examples: {
      confirmacionCompra: {
        summary: 'Correo de confirmacion de compra',
        value: {
          to: 'cliente@empresa.com',
          subject: 'Confirmacion de compra #9812',
          body: 'Tu pedido fue procesado correctamente. Gracias por tu compra.',
        },
      },
      conOpcionesAvanzadas: {
        summary: 'Correo individual con opciones de entrega',
        value: {
          to: 'cliente@empresa.com',
          subject: 'Actualizacion de politica de privacidad',
          body: '<h1>Actualizacion importante</h1><p>Revisa los cambios aplicados.</p>',
          options: {
            from: 'notificaciones@empresa.com',
            replyTo: 'soporte@empresa.com',
            cc: ['auditoria@empresa.com'],
            headers: {
              'x-origin-service': 'mailer-service',
            },
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Correo enviado correctamente.',
  })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1000, ML-1001, ML-1002, ML-1003, ML-1004, ML-1005, ML-1027.',
  })
  async sendEmail(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: SendEmailDto,
  ) {
    await this.emailService.sendEmail(
      tenantId,
      body.to,
      body.subject,
      body.body,
      body.options,
    );

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
      'Payload para envio masivo. `recipients` debe contener correos validos y sin duplicados. `options` permite estrategia de entrega y metadatos.',
    examples: {
      mantenimientoProgramado: {
        summary: 'Notificacion de mantenimiento',
        value: {
          recipients: ['user1@empresa.com', 'user2@empresa.com'],
          subject: 'Mantenimiento programado',
          body: 'Este domingo entre 02:00 y 03:00 UTC realizaremos mantenimiento preventivo.',
        },
      },
      campanaBcc: {
        summary: 'Campana masiva en modo BCC',
        value: {
          recipients: ['user1@empresa.com', 'user2@empresa.com'],
          subject: 'Comunicado institucional',
          body: '<p>Nuevo comunicado para todos los usuarios activos.</p>',
          options: {
            from: 'comunicaciones@empresa.com',
            sendAsBcc: true,
            headers: {
              'x-campaign-id': 'camp-2026-04',
            },
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Correo masivo enviado correctamente.',
  })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1002, ML-1003, ML-1004, ML-1005, ML-1006, ML-1007, ML-1008, ML-1013, ML-1021, ML-1027.',
  })
  async sendBulkEmail(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: SendBulkEmailDto,
  ) {
    await this.emailService.sendBulkEmail(
      tenantId,
      body.recipients,
      body.subject,
      body.body,
      body.options,
    );

    return {
      sent: true,
      channel: 'email',
      type: 'bulk',
      recipientsCount: body.recipients.length,
    };
  }
}
