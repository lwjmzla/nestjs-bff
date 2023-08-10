import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  //app.use(MiddleWareAll)
  //app.setGlobalPrefix('api');
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const config = new DocumentBuilder()
    .setTitle('综合管理平台--swagger')
    .setDescription('综合管理平台--swagger')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-api', app, document);

  const port = configService.get('port') || 7000
  await app.listen(port, '0.0.0.0');
  const serverUrl = await app.getUrl();
  Logger.log(`api服务已经启动,请访问: ${serverUrl}`);
  Logger.log(`swagger-api服务已经启动,请访问: ${serverUrl}/swagger-api`);
}
bootstrap();
