import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';
import type { PhoneDeliveryOptions } from 'src/contexts/mailer/domain/types/delivery-options.type';

export class SendBulkPhoneMessageDto {
  @ApiProperty({
    type: [String],
    example: ['+51999888777', '+5215511122233'],
    description:
      'Listado de numeros telefonicos destino en formato internacional E.164 sin duplicados.',
  })
  @IsArray({ message: FoodaExceptionCodes.Ex1006.message })
  @ArrayNotEmpty({ message: FoodaExceptionCodes.Ex1007.message })
  @ArrayUnique({ message: FoodaExceptionCodes.Ex1021.message })
  @IsString({ each: true, message: FoodaExceptionCodes.Ex1013.message })
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    each: true,
    message: FoodaExceptionCodes.Ex1023.message,
  })
  recipients!: string[];

  @ApiProperty({
    example: 'Recordatorio: tu cita es hoy a las 16:30',
    description: 'Mensaje que se enviara a todos los destinatarios.',
  })
  @IsString({ message: FoodaExceptionCodes.Ex1011.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1012.message })
  message!: string;

  @ApiPropertyOptional({
    example: {
      from: '+15005550006',
      voiceUrl: 'https://api.midominio.com/twilio/voice.xml',
    },
    description: 'Opciones avanzadas de Twilio para operaciones masivas.',
  })
  @IsOptional()
  @IsObject({ message: FoodaExceptionCodes.Ex1027.message })
  options?: PhoneDeliveryOptions;
}
