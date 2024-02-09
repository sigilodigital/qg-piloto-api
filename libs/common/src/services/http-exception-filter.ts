import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from './response-handler-v1';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    // Este filtro de exceção substitui o conteúdo de 'qualquer' outra exceção que aconteça
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const responseException = exception.getResponse();

        response.status(status).json(responseException);
    }
}