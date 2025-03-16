// src/common/middleware/security.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private helmetMiddleware = helmet();
  private rateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 solicitudes por ventana
    standardHeaders: true,
    legacyHeaders: false,
  });

  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Aplicar middleware de seguridad
    this.helmetMiddleware(req, res, (err: any) => {
      if (err) return next(err);
      
      // Solo aplicar rate limiting en producción
      if (this.configService.get('NODE_ENV') === 'production') {
        this.rateLimitMiddleware(req, res, next);
      } else {
        next();
      }
    });
  }
}