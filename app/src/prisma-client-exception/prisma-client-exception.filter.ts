import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, ' ');

    switch (exception.code) {
      case 'P2002':
        const statusConflict = HttpStatus.CONFLICT;
        response.status(statusConflict).json({
          statusCode: statusConflict,
          message: message,
        });
        break;
      case 'P2025':
        const statusNotFound = HttpStatus.NOT_FOUND;
        response.status(statusNotFound).json({
          statusCode: statusNotFound,
          message: message,
        });
        break;
      default:
        // default 500 error code
        // Prisma.PrismaClientUnknownRequestError は様々なエラーがあるので、対応していないエラー型は 500 で返す
        // https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
        super.catch(exception, host);
        break;
    }
  }
}
