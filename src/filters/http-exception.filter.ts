import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  LoggerService,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // !可以细化过滤信息
    // console.log(exception)
    // console.log(exception instanceof HttpException)
    
    let msg = exception['reponse'] || exception['message'] || 'Internal Server Error'
    if (exception instanceof HttpException) {
      console.log(exception.getResponse())
      console.log(exception.message)
      msg = exception.getResponse() || exception.message
    }

    if (exception instanceof BadRequestException) {
      if (msg?.message?.length) {
        msg = msg?.message[0]
      }
    }

    if (exception instanceof NotFoundException) {
      msg = msg?.message || msg
    }

    const responseLog = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      path: httpAdapter.getRequestUrl(request),
      exception: exception['name'],
      error: exception['reponse'] || 'Internal Server Error',
      hostname: httpAdapter.getRequestHostname(request),
      message: exception instanceof HttpException ? (exception.getResponse()) : [(exception as Error).message.toString()],
      msg,
      method: httpAdapter.getRequestMethod(request),
      stackTrace: exception instanceof HttpException ? '' : (exception as Error).stack
    };

    this.logger.error('[AllExceptionsFilter]', responseLog)

    const responseBody = {
      code: httpStatus,
      data: null,
      msg,
      success: false
    }
    
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}