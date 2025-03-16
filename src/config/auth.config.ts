import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  
  // Configuración de Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  
  // Configuración de Facebook OAuth
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  facebookCallbackUrl: process.env.FACEBOOK_CALLBACK_URL,
  
  // Configuración de verificación de email
  emailVerificationRequired: process.env.EMAIL_VERIFICATION_REQUIRED === 'true',
  emailVerificationExpiresIn: parseInt(process.env.EMAIL_VERIFICATION_EXPIRES_IN || '24', 10), // horas
  
  // Configuración de recuperación de contraseña
  passwordResetExpiresIn: parseInt(process.env.PASSWORD_RESET_EXPIRES_IN || '1', 10), // horas
  
  // Configuración de seguridad
  maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
  loginLockoutTime: parseInt(process.env.LOGIN_LOCKOUT_TIME || '15', 10), // minutos
}));