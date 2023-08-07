import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { loadNacosConfig } from './nacos.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //cache: true,
      // 由于 nacos 需要异步获取, 这里使用 load 的异步方式.
      load: [async () => loadNacosConfig()],
    }),
  ],
})
export class VmpConfigModule {}
