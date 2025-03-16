import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Aplicación
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  CORS_ORIGINS: Joi.string().default('*'),
  
  // Base de datos
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SSL: Joi.boolean().default(false),
  DB_SYNC: Joi.boolean().default(false),
  
  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  
  // Bcrypt
  BCRYPT_SALT_ROUNDS: Joi.number().default(10),
  
  // Email
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_FROM: Joi.string().required(),
  MAIL_SECURE: Joi.boolean().default(false),
  
  // Verificación
  EMAIL_VERIFICATION_REQUIRED: Joi.boolean().default(true),
  EMAIL_VERIFICATION_EXPIRES_IN: Joi.number().default(24),
  PASSWORD_RESET_EXPIRES_IN: Joi.number().default(1),
  
  // Seguridad
  MAX_LOGIN_ATTEMPTS: Joi.number().default(5),
  LOGIN_LOCKOUT_TIME: Joi.number().default(15),
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),
});