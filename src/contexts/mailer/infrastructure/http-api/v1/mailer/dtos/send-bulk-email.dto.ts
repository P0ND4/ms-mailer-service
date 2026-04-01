import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';
import type { EmailDeliveryOptions } from 'src/contexts/mailer/domain/types/delivery-options.type';

export class SendBulkEmailDto {
  @ApiProperty({
    type: [String],
    example: ['user1@empresa.com', 'user2@empresa.com'],
    description:
      'Lista de destinatarios. Cada correo debe tener formato valido y no puede repetirse.',
  })
  @IsArray({ message: FoodaExceptionCodes.Ex1006.message })
  @ArrayNotEmpty({ message: FoodaExceptionCodes.Ex1007.message })
  @ArrayUnique({ message: FoodaExceptionCodes.Ex1021.message })
  @IsString({ each: true, message: FoodaExceptionCodes.Ex1013.message })
  @IsEmail({}, { each: true, message: FoodaExceptionCodes.Ex1008.message })
  recipients!: string[];

  @ApiProperty({
    example: 'Campana de mantenimiento programado',
    description: 'Asunto compartido para todos los destinatarios.',
  })
  @IsString({ message: FoodaExceptionCodes.Ex1002.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1003.message })
  subject!: string;

  @ApiProperty({
    example:
      'Este domingo entre 02:00 y 03:00 UTC realizaremos mantenimiento preventivo.',
    description: 'Contenido del correo masivo.',
  })
  @IsString({ message: FoodaExceptionCodes.Ex1004.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1005.message })
  body!: string;

  @ApiPropertyOptional({
    example: {
      from: 'notificaciones@empresa.com',
      sendAsBcc: true,
      headers: { 'x-campaign': 'maintenance-2026-04' },
    },
    description:
      'Opciones avanzadas para correo masivo (por ejemplo, modo BCC, remitente o headers).',
  })
  @IsOptional()
  @IsObject({ message: FoodaExceptionCodes.Ex1027.message })
  options?: EmailDeliveryOptions;
}
