import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';

export class SendEmailDto {
  @ApiProperty({
    example: 'cliente@empresa.com',
    description: 'Correo del destinatario final del mensaje.',
  })
  @IsEmail({}, { message: FoodaExceptionCodes.Ex1000.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1001.message })
  to!: string;

  @ApiProperty({
    example: 'Confirmacion de compra #9812',
    description: 'Asunto visible del correo.',
  })
  @IsString({ message: FoodaExceptionCodes.Ex1002.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1003.message })
  subject!: string;

  @ApiProperty({
    example:
      'Tu compra fue procesada correctamente. Te compartimos el resumen de tu pedido.',
    description: 'Contenido principal del correo, en texto plano o HTML.',
  })
  @IsString({ message: FoodaExceptionCodes.Ex1004.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1005.message })
  body!: string;
}