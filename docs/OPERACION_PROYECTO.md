# Documentacion Operativa - Mailer Service

## 1. Resumen
Este servicio es un microservicio de mensajeria basado en NestJS, BullMQ y Redis.
Esta disenado como un servicio generico y personalizable para distintas estrategias de notificacion y validacion OTP.

Responsabilidades principales:
- Envio de correo (individual y masivo).
- Envio por SMS, WhatsApp y llamada de voz (individual y masivo).
- Generacion y validacion de codigos OTP.
- Aplicacion de reglas de seguridad OTP (rate limit e intentos maximos).

Prefijos importantes:
- API base: `/api`
- Dominio Mailer v1: `/api/v1/mailer`
- Swagger (no produccion): `/api`

## 2. Requisitos
- Node.js 22+
- pnpm (via Corepack recomendado)
- Redis 7+
- Cuenta SMTP valida para envio de correo (si se usa canal email)
- Cuenta Twilio valida para canales telefonicos (si se usan SMS/WhatsApp/Voice)

## 3. Archivos de Configuracion Clave
- Configuracion de entorno: `src/config/environment.config.ts`
- Configuracion de BullMQ/Redis: `src/config/bull.config.ts`
- Conexion Redis base: `src/database/redis.module.ts`
- Bootstrap app: `src/main.ts`

## 4. Variables de Entorno
Usar `.env.example` como base.

### 4.1 Minimas para levantar local
- `PORT`
- `REDIS_HOST`
- `REDIS_PORT`

### 4.2 Segun canal requerido
Canal correo:
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_SECURE`
- `MAIL_USER` o `MAIL_FROM`
- `MAIL_PASSWORD` (si aplica autenticacion SMTP)

Canales telefonicos:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- Al menos una configuracion de origen por canal (`TWILIO_SMS_FROM`, `TWILIO_WHATSAPP_FROM`, `TWILIO_VOICE_FROM`) o `messagingServiceSid` por request.

OTP Security:
- `OTP_MAX_VALIDATE_ATTEMPTS`
- `OTP_VALIDATE_ATTEMPTS_TTL_SECONDS`
- `OTP_GENERATE_RATE_LIMIT_MAX_REQUESTS`
- `OTP_GENERATE_RATE_LIMIT_WINDOW_SECONDS`

## 5. Ejecucion Local (sin Docker)
1. Instalar dependencias:
```bash
pnpm install
```
2. Crear `.env` desde `.env.example`.
3. Levantar Redis.
4. Compilar:
```bash
pnpm build
```
5. Ejecutar en desarrollo:
```bash
pnpm start:dev
```

## 6. Scripts Utiles
- `pnpm setup`: selecciona flujo dev/prod segun entorno.
- `pnpm setup:dev`: levanta Redis con Docker y arranca app local.
- `pnpm setup:prod`: levanta stack completo en Docker.
- `pnpm build`: compila TypeScript.
- `pnpm start:dev`: arranque en desarrollo.
- `pnpm test:unit`: unit tests.
- `pnpm test:unit:cov`: unit tests con cobertura.
- `pnpm test:e2e`: e2e tests.

## 7. Que se debe hacer
- Validar `pnpm build` y `pnpm test:unit:cov` antes de desplegar.
- Configurar solo los canales que se van a usar en cada entorno.
- Gestionar secretos por variables de entorno o secret manager.
- Mantener Redis accesible solo por red privada.
- Usar codigos de error personalizados para trazabilidad (`ML-xxxx`).

## 8. Que no se debe hacer
- No exponer credenciales SMTP o Twilio en repositorio.
- No dejar Redis abierto a internet sin controles.
- No usar configuraciones de callback/url de desarrollo en produccion.
- No desactivar controles OTP en entornos productivos.

## 9. Docker

### 9.1 Dockerfile (2 stages)
Se implementaron 2 etapas:
- `builder`: instala dependencias, compila y reduce dependencias a runtime.
- `runner`: imagen final liviana con `dist` y `node_modules` de produccion.

### 9.2 Levantar stack con Docker Compose
```bash
docker compose up -d --build
```

Servicios levantados:
- `mailer-service` (app)
- `mailer-redis` (Redis)

### 9.3 Detener stack
```bash
docker compose down
```

### 9.4 Limpiar volumenes (destructivo)
```bash
docker compose down -v
```

## 10. Si uso otro proveedor de correo o telefono, que pasa?
El servicio actual esta preparado con proveedores concretos:
- Correo: Nodemailer (`EmailChannelProvider`)
- Telefonia: Twilio (`TwilioChannelProvider`)

### 10.1 Si cambias solo variables sin adaptar proveedor
- Puede iniciar, pero fallaran envios en runtime del canal afectado.
- Obtendras codigos de configuracion (`ML-2000`, `ML-2003`, `ML-2004`) o de integracion (`ML-2002`, `ML-2005`).

### 10.2 Que deberias cambiar
1. Crear un provider alternativo para el nuevo proveedor.
2. Mantener contratos de payload actuales (`SendEmailJobData`, `SendPhoneJobData`).
3. Registrar el provider en `src/contexts/mailer/infrastructure/http-api/v1/mailer/mailer.module.ts`.
4. Mantener codigos de error personalizados para observabilidad.
5. Revalidar pruebas unitarias de providers/processors.

## 11. Redis: notas de compatibilidad
- Si usas `REDIS_URL`, tiene prioridad sobre `REDIS_HOST` y `REDIS_PORT`.
- Si usas ACL, configurar `REDIS_USERNAME` y `REDIS_PASSWORD`.
- Si Redis no esta disponible, fallan colas BullMQ y validacion OTP.

## 12. Troubleshooting rapido

### 12.1 Error de conexion Redis
- Verificar `REDIS_HOST`, `REDIS_PORT`, `REDIS_URL` y credenciales.
- Si la app corre fuera de Docker, usar `REDIS_HOST=localhost`.
- Si la app corre dentro de Docker Compose, usar `REDIS_HOST=redis`.

### 12.2 Error de envio SMTP
- Verificar `MAIL_HOST`, `MAIL_PORT`, `MAIL_SECURE`, `MAIL_USER` y `MAIL_PASSWORD`.
- Confirmar `MAIL_FROM` o `MAIL_USER` para remitente por defecto.

### 12.3 Error de envio Twilio
- Verificar `TWILIO_ACCOUNT_SID` y `TWILIO_AUTH_TOKEN`.
- Revisar configuracion de origen por canal (`TWILIO_SMS_FROM`, `TWILIO_WHATSAPP_FROM`, `TWILIO_VOICE_FROM`) o `messagingServiceSid`.

### 12.4 Swagger no aparece
- Swagger solo se publica cuando `NODE_ENV != production`.

## 13. Checklist antes de produccion
- [ ] `NODE_ENV=production`
- [ ] secretos reales cargados por entorno
- [ ] `pnpm build` en verde
- [ ] `pnpm test:unit:cov` en verde
- [ ] `docker compose config` valido
- [ ] monitoreo de Redis y colas habilitado
- [ ] callbacks externos (Twilio/voice) validados

## 14. Comandos recomendados de verificacion
```bash
pnpm build
pnpm test:unit:cov
docker compose config
docker compose up -d --build
```
