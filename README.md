# Mailer Service

Microservicio de mensajeria basado en NestJS para envio de correo, SMS, WhatsApp, llamada de voz y gestion de codigos OTP.

## Alcance
- Envio individual y masivo por correo.
- Envio individual y masivo por SMS.
- Envio individual y masivo por WhatsApp.
- Envio individual y masivo por llamada de voz.
- Generacion y validacion de OTP con reglas de seguridad (rate limit e intentos maximos).

## Stack
- NestJS
- BullMQ
- Redis (ioredis)
- Nodemailer
- Twilio
- Swagger
- Jest (unit y e2e)
- Docker / Docker Compose

## Endpoints base
- Base API: `/api`
- Dominio Mailer v1: `/api/v1/mailer`
- Swagger (no produccion): `/api`

## Inicio rapido
1. Instalar dependencias.
```bash
pnpm install
```
2. Preparar entorno.
```bash
cp .env.example .env
```
3. Levantar en desarrollo.
```bash
pnpm setup:dev
```

## Scripts principales
- `pnpm setup`
- `pnpm setup:dev`
- `pnpm setup:prod`
- `pnpm start:dev`
- `pnpm build`
- `pnpm test:unit`
- `pnpm test:unit:cov`
- `pnpm test:e2e`
- `pnpm test:cov`

## Docker
Arranque del stack:
```bash
docker compose up -d --build
```

Servicios levantados:
- `mailer-service`
- `mailer-redis`

Politica de puertos:
- Se expone solo el puerto HTTP del servicio (`PORT`, por defecto `3000`).
- Redis queda en red interna Docker para el servicio.

## Variables de entorno clave
- `PORT`, `NODE_ENV`
- `REDIS_URL` o (`REDIS_HOST`, `REDIS_PORT`, `REDIS_USERNAME`, `REDIS_PASSWORD`)
- Correo: `MAIL_HOST`, `MAIL_PORT`, `MAIL_SECURE`, `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_FROM`
- Twilio: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_SMS_FROM`, `TWILIO_WHATSAPP_FROM`, `TWILIO_VOICE_FROM`, etc.
- OTP Security: `OTP_MAX_VALIDATE_ATTEMPTS`, `OTP_VALIDATE_ATTEMPTS_TTL_SECONDS`, `OTP_GENERATE_RATE_LIMIT_MAX_REQUESTS`, `OTP_GENERATE_RATE_LIMIT_WINDOW_SECONDS`

## Documentacion operativa
Para procedimientos detallados de despliegue, troubleshooting, personalizacion y checklist:
- [docs/OPERACION_PROYECTO.md](docs/OPERACION_PROYECTO.md)