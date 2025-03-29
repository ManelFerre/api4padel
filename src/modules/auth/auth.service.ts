// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { UsersService } from '../users/users.service';
import { MailService } from '../../providers/mail/mail.service'; // Asegúrate de que la ruta sea correcta
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      return null;
    }
    
    // Verificar si la cuenta está bloqueada por demasiados intentos fallidos
    const maxLoginAttempts = this.configService.get<number>('MAX_LOGIN_ATTEMPTS', 5);
    const lockoutTimeMinutes = this.configService.get<number>('LOCKOUT_TIME_MINUTES', 30);
    
    if (user.login_attempts >= maxLoginAttempts && user.last_failed_login) {
      const lockoutTime = new Date(user.last_failed_login.getTime() + lockoutTimeMinutes * 60 * 1000);
      
      if (new Date() < lockoutTime) {
        throw new UnauthorizedException('Cuenta bloqueada temporalmente por demasiados intentos fallidos');
      }
      
      // Si ya pasó el tiempo de bloqueo, resetear los intentos
      await this.usersService.resetLoginAttempts(user.id);
    }
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Incrementar contador de intentos fallidos
      await this.usersService.incrementLoginAttempts(user.id);
      return null;
    }
    
    // Resetear contador de intentos fallidos
    await this.usersService.resetLoginAttempts(user.id);
    
    // Actualizar último login
    await this.usersService.updateLastLogin(user.id);
    
    // Excluir la contraseña del objeto de usuario
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    const payload = { email: user.email, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar que las contraseñas coincidan
    if (registerDto.password !== registerDto.confirm_password) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // Crear usuario
    const newUser = await this.usersService.create({
      first_name: registerDto.first_name,
      last_name: registerDto.last_name,
      email: registerDto.email,
      password: registerDto.password,
      phone: registerDto.phone,
      level: registerDto.level || 5,
    });
    
    // Generar token de verificación de email
    const token = uuidv4();
    const expiresIn = this.configService.get<number>('EMAIL_VERIFICATION_EXPIRES_HOURS', 24);
    
    await this.usersService.createVerificationToken({
      user_id: newUser.id,
      token,
      type: 'email_verification',
      expires_at: new Date(Date.now() + expiresIn * 60 * 60 * 1000).toISOString(),
    });
    
    // Enviar email de verificación
    try {
      await this.mailService.sendVerificationEmail(newUser.email, token);
      this.logger.log(`Correo de verificación enviado a ${newUser.email}`);
    } catch (error) {
      this.logger.error(`Error al enviar correo de verificación a ${newUser.email}: ${error.message}`);
      // No lanzamos el error para no interrumpir el registro
    }
    
    // Excluir la contraseña del objeto de usuario
    const { password: _, ...result } = newUser;
    
    return {
      message: 'Usuario registrado correctamente. Por favor, verifique su email.',
      user: result,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      const user = await this.usersService.findById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      
      const newPayload = { email: user.email, sub: user.id };
      
      return {
        access_token: this.jwtService.sign(newPayload),
        refresh_token: this.jwtService.sign(newPayload, {
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Token de refresco inválido');
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const verificationToken = await this.usersService.findVerificationToken(
      verifyEmailDto.token,
      'email_verification',
    );
    
    if (!verificationToken) {
      throw new BadRequestException('Token de verificación inválido o expirado');
    }
    
    if (new Date() > new Date(verificationToken.expires_at)) {
      throw new BadRequestException('Token de verificación expirado');
    }
    
    // Marcar token como usado
    await this.usersService.markTokenAsUsed(verificationToken.id);
    
    // Marcar email como verificado
    await this.usersService.verifyEmail(verificationToken.user_id);
    
    return {
      message: 'Email verificado correctamente',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    
    if (!user) {
      // No revelar si el email existe o no por seguridad
      return {
        message: 'Si el email está registrado, recibirá un enlace para restablecer su contraseña',
      };
    }
    
    // Generar token de restablecimiento de contraseña
    const token = uuidv4();
    const expiresIn = this.configService.get<number>('PASSWORD_RESET_EXPIRES_HOURS', 1);
    
    await this.usersService.createVerificationToken({
      user_id: user.id,
      token,
      type: 'password_reset',
      expires_at: new Date(Date.now() + expiresIn * 60 * 60 * 1000).toISOString(),
    });
    
    // Enviar email con enlace de restablecimiento
    try {
      await this.mailService.sendPasswordResetEmail(user.email, token);
      this.logger.log(`Correo de restablecimiento de contraseña enviado a ${user.email}`);
    } catch (error) {
      this.logger.error(`Error al enviar correo de restablecimiento a ${user.email}: ${error.message}`);
      // No lanzamos el error para no revelar si el email existe
    }
    
    return {
      message: 'Si el email está registrado, recibirá un enlace para restablecer su contraseña',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }
    
    const resetToken = await this.usersService.findVerificationToken(
      resetPasswordDto.token,
      'password_reset',
    );
    
    if (!resetToken) {
      throw new BadRequestException('Token de restablecimiento inválido o expirado');
    }
    
    if (new Date() > new Date(resetToken.expires_at)) {
      throw new BadRequestException('Token de restablecimiento expirado');
    }
    
    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
    
    // Actualizar contraseña
    await this.usersService.updatePassword(resetToken.user_id, hashedPassword);
    
    // Marcar token como usado
    await this.usersService.markTokenAsUsed(resetToken.id);
    
    return {
      message: 'Contraseña restablecida correctamente',
    };
  }

  async createSocialUser(email: string, firstName: string, lastName: string, provider: string) {
    // Verificar si el usuario ya existe
    let user = await this.usersService.findByEmail(email);
    
    if (user) {
      return user;
    }
    
    // Crear usuario
    user = await this.usersService.create({
      email,
      first_name: firstName,
      last_name: lastName,
      password: await bcrypt.hash(uuidv4(), 10), // Contraseña aleatoria
      email_verified: true, // El email ya está verificado por el proveedor social
    } as any);
    
    return user;
  }
}