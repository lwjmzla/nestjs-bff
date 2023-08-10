import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class HttpServiceInterceptor implements NestInterceptor {
  constructor(private httpService: HttpService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const host = context.switchToHttp();
    const request = host.getRequest<Request>();
    const headers: any = request.headers;
    if (headers.usertoken) {
      // console.log(headers.usertoken)
      this.httpService.axiosRef.defaults.headers.common['userToken'] = headers.usertoken;
    }
    // return next.handle().pipe(
    //   catchError((e) => {
    //     throw new HttpException(e.response.statusText, e.response.status); // !这种改变了报错的Exception类型
    //   }),
    // );
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After...`)),
      );
  }
}
