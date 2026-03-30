import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { V1_MAILER } from '../../../route.constants';

import { ICodeUseCase } from 'src/contexts/mailer/domain/use-cases/mailer/code.use-case.interface';
import { GenerateCodeDto } from '../dtos/generate-code.dto';
import { ValidateCodeDto } from '../dtos/validate-code.dto';

@ApiTags('Mailer Code')
@Controller(`${V1_MAILER}/code`)
export class CodeController {
  constructor(private readonly codeService: ICodeUseCase) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generar codigo temporal',
    description:
      'Genera un codigo numerico temporal con la longitud solicitada. Se usa tipicamente para OTP o verificacion.',
  })
  @ApiBody({
    type: GenerateCodeDto,
    description: 'Configura la longitud del codigo numerico a generar.',
    examples: {
      otp6: {
        summary: 'Generar OTP de 6 digitos',
        value: {
          length: 6,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Codigo generado correctamente.',
  })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1014, ML-1015, ML-1016.',
  })
  generateCode(@Body() body: GenerateCodeDto) {
    const code = this.codeService.generateCode(body.length);

    return {
      code,
      length: body.length,
    };
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validar codigo temporal',
    description:
      'Compara el codigo ingresado contra el hash o valor esperado y devuelve el resultado de validacion.',
  })
  @ApiBody({
    type: ValidateCodeDto,
    description:
      'Incluye el codigo recibido y el hash (o valor esperado) para validar coincidencia.',
    examples: {
      validacionExitosa: {
        summary: 'Validacion exitosa',
        value: {
          code: '482913',
          hash: '482913',
        },
      },
      validacionFallida: {
        summary: 'Validacion fallida',
        value: {
          code: '111111',
          hash: '482913',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Resultado de validacion calculado correctamente.',
  })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1017, ML-1018, ML-1019, ML-1020.',
  })
  validateCode(@Body() body: ValidateCodeDto) {
    const valid = this.codeService.validateCode(body.code, body.hash);
    return {
      valid,
    };
  }
}
