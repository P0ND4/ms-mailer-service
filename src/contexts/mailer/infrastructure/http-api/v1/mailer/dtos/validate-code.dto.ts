import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';

const HASH_CONTEXTUAL_REGEX =
  /^[A-Za-z0-9_-]+:[A-Za-z0-9_-]+:[A-Za-z0-9_-]+(?::[A-Za-z0-9_-]+)?$/;

export class ValidateCodeDto {
  @ApiProperty({
    example: '482913',
    description: 'Codigo ingresado por el usuario final para validacion.',
  })
  @IsString({ message: FoodaExceptionCodes.Ex1017.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1018.message })
  code!: string;

  @ApiProperty({
    example: 'user123:login:sms:tenantA',
    description:
      'Identificador contextual del desafio OTP. Formato: userId:purpose:channel[:tenant].',
  })
  @IsString({ message: FoodaExceptionCodes.Ex1019.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1020.message })
  @Matches(HASH_CONTEXTUAL_REGEX, {
    message: FoodaExceptionCodes.Ex1028.message,
  })
  hash!: string;
}
