import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LogsModule } from './logs/logs.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { MsgModule } from './modules/msg/msg.module';
import { HttpServiceInterceptor } from './interceptors/http-service.interceptors';
import { HttpModule } from '@nestjs/axios';
import { VmpConfigModule } from './config/config.module';

@Module({
  imports: [
    VmpConfigModule,
    HttpModule,
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [() => ({})], // !todo nacos获取配置信息  
    // }),
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
  ],
})
export class AppModule {}
