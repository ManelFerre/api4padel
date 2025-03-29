import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Obtener la respuesta
    const response = context.switchToHttp().getResponse();
    
    // Establecer headers de seguridad adicionales
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('X-XSS-Protection', '1; mode=block');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");
    
    // Continuar con el flujo normal
    return next.handle().pipe(
      map(data => {
        // Sanitizar datos sensibles en la respuesta si es necesario
        if (data && typeof data === 'object') {
          this.sanitizeResponseData(data);
        }
        return data;
      }),
    );
  }

  private sanitizeResponseData(data: any): void {
    // Eliminar campos sensibles de la respuesta
    const sensitiveFields = ['password', 'password_hash', 'token', 'secret'];
    
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item && typeof item === 'object') {
          this.sanitizeResponseData(item);
        }
      });
    } else if (data && typeof data === 'object') {
      for (const key of Object.keys(data)) {
        if (sensitiveFields.includes(key)) {
          delete data[key];
        } else if (data[key] && typeof data[key] === 'object') {
          this.sanitizeResponseData(data[key]);
        }
      }
    }
  }
}