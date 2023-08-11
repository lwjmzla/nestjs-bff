import { Module } from '@nestjs/common';
import { WinstonModule, WinstonModuleOptions, utilities } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file'
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) { // !可以根据环境变量觉得是否开启log
        const transports = [
          new winston.transports.Console({
            format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike()),
          }),
          // 保存到文件 // !只要执行了new winston.transports.DailyRotateFile就会产生日志。
          new winston.transports.DailyRotateFile({
            // 日志文件文件夹，建议使用path.join()方式来处理，或者process.cwd()来设置，此处仅作示范
            dirname: 'logs',
            // 日志文件名 %DATE% 会自动设置为当前日期
            filename: 'info-%DATE%.log',
            // 日期格式
            datePattern: 'YYYY-MM-DD-HH',
            // 压缩文档，用于定义是否对存档的日志文件进行 gzip 压缩 默认值 false
            zippedArchive: true,
            // 文件最大大小，可以是bytes、kb、mb、gb
            maxSize: '20m',
            // 最大文件数，可以是文件数也可以是天数，天数加单位"d"，
            maxFiles: '7d',
            // 格式定义，同winston
            format: winston.format.combine(
              winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
              }),
              winston.format.json(),
            ),
            // 日志等级，不设置所有日志将在同一个文件
            level: 'info',
          }),
          // 同上述方法，区分error日志和info日志，保存在不同文件，方便问题排查
          new winston.transports.DailyRotateFile({
            dirname: 'logs',
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
              winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
              }),
              winston.format.json(),
            ),
            level: 'error',
          }),
        ]
        return {
          transports
        } as WinstonModuleOptions
      },
    })
  ]
})
export class LogsModule {}
