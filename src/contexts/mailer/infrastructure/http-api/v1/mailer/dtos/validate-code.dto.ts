import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';

export class ValidateCodeDto {
  @ApiProperty({
    example: '482913',
    description: 'Codigo ingresado por el usuario final para validacion.',
  })
  @IsString({ message: FoodaExceptionCodes.Ex1017.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1018.message })
  code!: string;

  @ApiProperty({
    example: '482913',
    description:
      'Hash o valor esperado contra el cual se debe validar el codigo recibido.',
  })
  @IsString({ message: FoodaExceptionCodes.Ex1019.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1020.message })
  hash!: string;
}