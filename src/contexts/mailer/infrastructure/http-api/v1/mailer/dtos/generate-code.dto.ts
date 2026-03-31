import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';

export class GenerateCodeDto {
  @ApiProperty({
    example: 'otp-login-user-123',
    description:
      'Identificador unico de referencia para guardar el codigo en Redis.',
  })
  @IsString({ message: FoodaExceptionCodes.Ex1019.message })
  @IsNotEmpty({ message: FoodaExceptionCodes.Ex1020.message })
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
