import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';

const HASH_CONTEXTUAL_REGEX =
  /^[A-Za-z0-9_-]+:[A-Za-z0-9_-]+:[A-Za-z0-9_-]+(?::[A-Za-z0-9_-]+)?$/;

export class GenerateCodeDto {
  @ApiProperty({
    example: 'user123:login:sms:tenantA',
    description:
      'Identificador contextual para guardar el codigo en Redis. Formato: userId:purpose:channel[:tenant].',
  })
  @IsString({ message: FoodaExceptionCodes.Ex1019.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1020.message })
  @Matches(HASH_CONTEXTUAL_REGEX, {
    message: FoodaExceptionCodes.Ex1028.message,
  })
  hash!: string;

  @ApiProperty({
    example: 6,
    minimum: 4,
    maximum: 12,
    description:
      'Longitud del codigo a generar. Debe estar entre 4 y 12 caracteres numericos.',
  })
  @Type(() => Number)
  @IsInt({ message: FoodaExceptionCodes.Ex1014.message })
  @Min(4, { message: FoodaExceptionCodes.Ex1015.message })
  @Max(12, { message: FoodaExceptionCodes.Ex1016.message })
  length!: number;

  @ApiProperty({
    example: 300,
    minimum: 30,
    maximum: 1800,
    required: false,
    description:
      'Tiempo de vida en segundos del codigo en Redis. Si se omite, se usa 300.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: FoodaExceptionCodes.Ex1024.message })
  @Min(30, { message: FoodaExceptionCodes.Ex1025.message })
  @Max(1800, { message: FoodaExceptionCodes.Ex1026.message })
  ttlSeconds?: number;
}
