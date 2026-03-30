import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { FoodaExceptionCodes } from 'src/contexts/shared/domain/exceptions/mailer-exception.codes';

export class GenerateCodeDto {
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
}
