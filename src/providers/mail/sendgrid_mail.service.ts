// src/providers/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {
    // Inicializar SendGrid con la API key
    const sendgridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!sendgridApiKey) {
      console.error('SENDGRID_API_KEY no está configurada');
    } else {
      sgMail.setApiKey(sendgridApiKey);
    }
  }

  async sendMail(options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
  }): Promise<void> {
    const fromEmail = options.from || this.configService.get<string>('MAIL_FROM_ADDRESS');
    
    const msg = {
      to: options.to,
      from: fromEmail,
      subject: options.subject,
      html: options.html,
      text: options.text || '',
    };
    
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error al enviar correo:', error);
      if (error.response) {
        console.error(error.response.body);
      }
      throw error;
    }
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const fromEmail = this.configService.get<string>('MAIL_FROM_ADDRESS');
    
    const verificationUrl = `${frontendUrl}/auth/verify-email?token=${token}`;
    
    const msg = {
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
    };
    
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error al enviar correo de verificación:', error);
      if (error.response) {
        console.error(error.response.body);
      }
      throw error;
    }
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const fromEmail = this.configService.get<string>('MAIL_FROM_ADDRESS');
    
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;
    
    const msg = {
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
    };
    
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error al enviar correo de restablecimiento de contraseña:', error);
      if (error.response) {
        console.error(error.response.body);
      }
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, firstName: string): Promise<void> {
    const fromEmail = this.configService.get<string>('MAIL_FROM_ADDRESS');
    
    const msg = {
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
    };
    
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error al enviar correo de bienvenida:', error);
      if (error.response) {
        console.error(error.response.body);
      }
      throw error;
    }
  }

  async sendMatchInvitation(to: string, matchDetails: any, inviterName: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const fromEmail = this.configService.get<string>('MAIL_FROM_ADDRESS');
    
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
    
    const msg = {
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
    };
    
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error al enviar invitación a partido:', error);
      if (error.response) {
        console.error(error.response.body);
      }
      throw error;
    }
  }
}