import pino from 'pino';

const isProd = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  transport: isProd
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true, singleLine: true },
      },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'passwordHash',
      'token',
      '*.cardNumber',
      '*.cvv',
      '*.cvc',
      '*.authorization',
      '*.access_token',
      '*.refresh_token',
      '*.id_token',
      'email', // attention: redaction globale email; retirez si vous avez besoin dans des logs techniques
    ],
    censor: '[REDACTED]',
  },
});