import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, Observable, tap } from 'rxjs';
import { ResponseDto } from '../class/res.class';
import { Reflector } from '@nestjs/core';
import { TRANSFORM_KEEP_KEY_METADATA } from '../contants/decorator.contants';

@Injectable()
export class HttpServiceInterceptor implements NestInterceptor {
  constructor(private httpService: HttpService, private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const host = context.switchToHttp();
    const request = host.getRequest<Request>();
    const headers: any = request.headers;
    if (headers.usertoken) {
      this.httpService.axiosRef.defaults.headers.common['userToken'] = headers.usertoken;
    }

    return next.handle().pipe(
        tap(() => console.log(`After...`)),
        map((data) => {
          //console.log('map', data)
          const isKeep = this.reflector.get<boolean>(
            TRANSFORM_KEEP_KEY_METADATA,
            context.getHandler(),
          );
          if (isKeep) { // !直接转发后端接口使用@Keep()
            return data;
          } else {
            //const response = context.switchToHttp().getResponse<FastifyReply>();
            //response.header('Content-Type', 'application/json; charset=utf-8');
            return new ResponseDto({ data });
          }
        }),
      );
  }
}
