import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
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
    description:
      'Configura la longitud, hash de referencia y ttl para guardar el codigo en Redis.',
    examples: {
      otp6: {
        summary: 'Generar OTP de 6 digitos y guardarlo',
        value: {
          hash: 'user123:login:sms:tenantA',
          length: 6,
          ttlSeconds: 300,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Codigo generado correctamente.',
  })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1014, ML-1015, ML-1016, ML-1019, ML-1020, ML-1024, ML-1025, ML-1026, ML-1028.',
  })
  @ApiTooManyRequestsResponse({
    description:
      'Se excedio el limite de solicitudes para generar codigos. Posible codigo: ML-3001.',
  })
  async generateCode(@Body() body: GenerateCodeDto) {
    const ttlSeconds = body.ttlSeconds ?? 300;
    const code = await this.codeService.generateCode(
      body.length,
      body.hash,
      ttlSeconds,
    );

    return {
      hash: body.hash,
      code,
      length: body.length,
      ttlSeconds,
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
          hash: 'user123:login:sms:tenantA',
        },
      },
      validacionFallida: {
        summary: 'Validacion fallida',
        value: {
          code: '111111',
          hash: 'user123:login:sms:tenantA',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Resultado de validacion calculado correctamente.',
  })
  @ApiBadRequestResponse({
    description:
      'Payload invalido. Posibles codigos: ML-1017, ML-1018, ML-1019, ML-1020, ML-1028.',
  })
  @ApiTooManyRequestsResponse({
    description:
      'Se excedio el limite de intentos de validacion. Posible codigo: ML-3000.',
  })
  async validateCode(@Body() body: ValidateCodeDto) {
    const valid = await this.codeService.validateCode(body.code, body.hash);
    return {
      valid,
    };
  }
}
