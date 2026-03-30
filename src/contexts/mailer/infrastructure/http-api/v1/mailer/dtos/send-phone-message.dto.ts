import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';

export class SendPhoneMessageDto {
  @ApiProperty({
    example: '+51999888777',
    description:
      'Numero telefonico del destinatario en formato internacional E.164.',
  })
  @IsString({ message: FoodaExceptionCodes.Ex1009.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1010.message })
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message: FoodaExceptionCodes.Ex1022.message,
  })
  to!: string;

  @ApiProperty({
    example: 'Tu codigo de verificacion es 482913',
    description: 'Mensaje a enviar por el canal telefonico seleccionado.',
  })
  @IsString({ message: FoodaExceptionCodes.Ex1011.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1012.message })
  message!: string;
}