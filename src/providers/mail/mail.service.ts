// src/providers/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('MAIL_HOST', 'smtp.hostinger.com');
    const port = this.configService.get<number>('MAIL_PORT', 465);
    const user = this.configService.get<string>('MAIL_USER');
    const password = this.configService.get<string>('MAIL_PASSWORD');
    const secure = this.configService.get<boolean>('MAIL_SECURE', true);

    this.logger.log(`Configurando cliente SMTP: ${host}:${port}, usuario: ${user}, secure: ${secure}`);

    // Configuración segura de nodemailer
    this.transporter = nodemailer.createTransport(smtpTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass: password,
      },
      tls: {
        // No verificar certificados
        rejectUnauthorized: false,
      },
      // Configuración de seguridad adicional
      connectionTimeout: 10000, // 10 segundos
      greetingTimeout: 10000,
      socketTimeout: 10000,
    }));

    // Verificar la conexión al iniciar
    this.testConnection();
  }

  private async testConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('Conexión SMTP establecida correctamente');
    } catch (error) {
      this.logger.error(`Error al conectar con el servidor SMTP: ${error.message}`);
      // No lanzamos el error para permitir que la aplicación siga funcionando
    }
  }

  async sendMail(options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
  }): Promise<void> {
    const fromEmail = options.from || this.configService.get<string>('MAIL_FROM');
    
    try {
      await this.transporter.sendMail({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || '',
      });
      this.logger.log(`Correo enviado correctamente a ${options.to}`);
    } catch (error) {
      this.logger.error(`Error al enviar correo a ${options.to}: ${error.message}`);
      throw error;
    }
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const fromEmail = this.configService.get<string>('MAIL_FROM');
    
    const verificationUrl = `${frontendUrl}/auth/verify-email?token=${token}`;
    
    try {
      await this.sendMail({
        to,
        from: fromEmail,
        subject: 'Verifica tu cuenta en API4Padel',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333;">Bienvenido a API4Padel</h2>
            <p>Gracias por registrarte. Por favor, verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
            <p style="margin: 20px 0;">
              <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Verificar mi correo electrónico</a>
            </p>
            <p>O copia y pega el siguiente enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #0066cc;">${verificationUrl}</p>
            <p>Este enlace expirará en 24 horas.</p>
            <p>Si no has solicitado esta verificación, puedes ignorar este correo.</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="color: #777; font-size: 12px;">© ${new Date().getFullYear()} API4Padel. Todos los derechos reservados.</p>
          </div>
        `,
      });
      this.logger.log(`Correo de verificación enviado a ${to}`);
    } catch (error) {
      this.logger.error(`Error al enviar correo de verificación a ${to}: ${error.message}`);
      // No lanzamos el error para no interrumpir el registro
    }
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const fromEmail = this.configService.get<string>('MAIL_FROM');
    
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;
    
    try {
      await this.sendMail({
        to,
        from: fromEmail,
        subject: 'Restablecimiento de contraseña en API4Padel',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333;">Restablecimiento de contraseña</h2>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
            <p style="margin: 20px 0;">
              <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Restablecer mi contraseña</a>
            </p>
            <p>O copia y pega el siguiente enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #0066cc;">${resetUrl}</p>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no has solicitado este restablecimiento, puedes ignorar este correo.</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="color: #777; font-size: 12px;">© ${new Date().getFullYear()} API4Padel. Todos los derechos reservados.</p>
          </div>
        `,
      });
      this.logger.log(`Correo de restablecimiento de contraseña enviado a ${to}`);
    } catch (error) {
      this.logger.error(`Error al enviar correo de restablecimiento a ${to}: ${error.message}`);
      // No lanzamos el error para no revelar si el email existe
    }
  }

  async sendWelcomeEmail(to: string, firstName: string): Promise<void> {
    const fromEmail = this.configService.get<string>('MAIL_FROM');
    
    try {
      await this.sendMail({
        to,
        from: fromEmail,
        subject: '¡Bienvenido a API4Padel!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333;">¡Bienvenido a API4Padel, ${firstName}!</h2>
            <p>Gracias por unirte a nuestra comunidad. Estamos emocionados de tenerte con nosotros.</p>
            <p>Con API4Padel, podrás:</p>
            <ul>
              <li>Organizar partidos de pádel fácilmente</li>
              <li>Encontrar jugadores de tu nivel</li>
              <li>Seguir tus estadísticas y progreso</li>
              <li>Participar en torneos y eventos</li>
            </ul>
            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
            <p>¡Disfruta jugando!</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="color: #777; font-size: 12px;">© ${new Date().getFullYear()} API4Padel. Todos los derechos reservados.</p>
          </div>
        `,
      });
      this.logger.log(`Correo de bienvenida enviado a ${to}`);
    } catch (error) {
      this.logger.error(`Error al enviar correo de bienvenida a ${to}: ${error.message}`);
    }
  }

  async sendMatchInvitation(to: string, matchDetails: any, inviterName: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const fromEmail = this.configService.get<string>('MAIL_FROM');
    
    const matchUrl = `${frontendUrl}/matches/${matchDetails.id}`;
    const date = new Date(matchDetails.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const time = new Date(matchDetails.date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    try {
      await this.sendMail({
        to,
        from: fromEmail,
        subject: `Invitación a partido de pádel de ${inviterName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333;">Invitación a partido de pádel</h2>
            <p>${inviterName} te ha invitado a un partido de pádel.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Fecha:</strong> ${date}</p>
              <p><strong>Hora:</strong> ${time}</p>
              <p><strong>Lugar:</strong> ${matchDetails.location}</p>
              <p><strong>Nivel:</strong> ${matchDetails.level}</p>
            </div>
            <p style="margin: 20px 0;">
              <a href="${matchUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block; margin-right: 10px;">Ver detalles</a>
            </p>
            <p>Puedes aceptar o rechazar esta invitación desde tu cuenta.</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="color: #777; font-size: 12px;">© ${new Date().getFullYear()} API4Padel. Todos los derechos reservados.</p>
          </div>
        `,
      });
      this.logger.log(`Invitación a partido enviada a ${to}`);
    } catch (error) {
      this.logger.error(`Error al enviar invitación a partido a ${to}: ${error.message}`);
    }
  }
}