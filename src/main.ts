import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  console.log(configService)
  //app.use(MiddleWareAll)
  //app.setGlobalPrefix('api');
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const port = 7000
  await app.listen(port, '0.0.0.0');
  const serverUrl = await app.getUrl();
  Logger.log(`api服务已经启动,请访问: ${serverUrl}`);
}
bootstrap();
