import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { LogsModule } from './logs/logs.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { MsgModule } from './modules/msg/msg.module';
import { HttpServiceInterceptor } from './common/interceptors/http-service.interceptors';
import { HttpModule, HttpService } from '@nestjs/axios';
import { VmpConfigModule } from './config/config.module';
import { configManager } from './config/nacos.configuration';
//import { authMiddleware } from './common/middleware/auth.middleware';
import { AuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [
    VmpConfigModule,
    HttpModule,
    LogsModule,
    MsgModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpServiceInterceptor,
    },
    {
			provide: APP_PIPE,
			useValue: new ValidationPipe({}),
		},
    {
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
  ],
})
export class AppModule implements NestModule{
  constructor(httpService: HttpService) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    httpService.axiosRef.interceptors.request.use(configManager.axiosRequestInterceptor(new RegExp('^cmn-base-')));
  }

  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(authMiddleware).forRoutes('*')
  }
}
