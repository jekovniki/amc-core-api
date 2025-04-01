import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { logger } from '../util/logger.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const requestId = `req-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const startTime = Date.now();

    const userData = request?.user
      ? {
          id: request.user.id,
          companyId: request.user.companyId,
        }
      : null;

    logger.info('Incoming request', {
      context: context.getClass().name,
      requestId,
      method,
      url,
      user: userData,
      body: request?.body,
    });

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const logType = statusCode >= 400 ? 'error' : 'info';

        logger[logType]('Outgoing response', {
          context: context.getClass().name,
          requestId,
          status: statusCode,
          method,
          url,
          user: userData,
          response: data && typeof data === 'object' ? data : 'Response sent',
        });
      }),
      catchError((error) => {
        // Log error response (including 401 and other errors)
        const duration = Date.now() - startTime;
        const statusCode = error.status || error.statusCode || 500;

        const errorMessage = `Error response: ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms`;
        logger.error(errorMessage, {
          context: context.getClass().name,
          requestId,
          user: userData,
          error: {
            message: error.message,
            stack: error.stack,
            response: error.response,
          },
        });

        // Re-throw the error to maintain normal exception flow
        throw error;
      }),
    );
  }
}
