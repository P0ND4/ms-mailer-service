export class FoodaExceptionInfo {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly service: string = 'mailer-service',
  ) {}
}

const SERVICE_PREFIX = 'ML';

export const FoodaExceptionCodes = {
  // Error Generico
  Ex0000: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-0000`,
    'Ha ocurrido un error desconocido en la solicitud.',
  ),
  Ex0001: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-0001`,
    'Ruta o recurso no encontrado',
  ),

  // Errores Generales (9000+)
  Ex9999: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-9999`,
    'Error interno del servidor.',
  ),

  // Errores de Validacion (1000-1999)
  Ex1000: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1000`,
    'El formato del correo destinatario es invalido',
  ),
  Ex1001: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1001`,
    'El correo destinatario no puede estar vacio',
  ),
  Ex1002: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1002`,
    'El asunto del correo tiene que ser un string',
  ),
  Ex1003: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1003`,
    'El asunto del correo no puede estar vacio',
  ),
  Ex1004: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1004`,
    'El cuerpo del correo tiene que ser un string',
  ),
  Ex1005: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1005`,
    'El cuerpo del correo no puede estar vacio',
  ),
  Ex1006: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1006`,
    'recipients tiene que ser un arreglo',
  ),
  Ex1007: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1007`,
    'recipients no puede estar vacio',
  ),
  Ex1008: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1008`,
    'Cada destinatario de recipients debe ser un correo valido',
  ),
  Ex1009: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1009`,
    'to tiene que ser un string',
  ),
  Ex1010: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1010`,
    'to no puede estar vacio',
  ),
  Ex1011: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1011`,
    'message tiene que ser un string',
  ),
  Ex1012: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1012`,
    'message no puede estar vacio',
  ),
  Ex1013: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1013`,
    'Cada destinatario de recipients tiene que ser un string',
  ),
  Ex1014: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1014`,
    'length tiene que ser un numero entero',
  ),
  Ex1015: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1015`,
    'length debe ser mayor o igual a 4',
  ),
  Ex1016: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1016`,
    'length debe ser menor o igual a 12',
  ),
  Ex1017: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1017`,
    'code tiene que ser un string',
  ),
  Ex1018: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1018`,
    'code no puede estar vacio',
  ),
  Ex1019: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1019`,
    'hash tiene que ser un string',
  ),
  Ex1020: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1020`,
    'hash no puede estar vacio',
  ),
  Ex1021: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1021`,
    'recipients no puede contener valores duplicados',
  ),
  Ex1022: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1022`,
    'to debe tener formato telefonico internacional E.164',
  ),
  Ex1023: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1023`,
    'Cada destinatario de recipients debe tener formato telefonico internacional E.164',
  ),
  Ex1024: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1024`,
    'ttlSeconds tiene que ser un numero entero',
  ),
  Ex1025: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1025`,
    'ttlSeconds debe ser mayor o igual a 30 segundos',
  ),
  Ex1026: new FoodaExceptionInfo(
    `${SERVICE_PREFIX}-1026`,
    'ttlSeconds debe ser menor o igual a 1800 segundos',
  ),
};
