/**
 * @description pm2 app 配置信息
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const os = require('os')

const cpuCoreLength = os.cpus().length // CPU 几核

module.exports = {
  name: 'nestjs-bff',
  script: 'dist/src/main.js',
  // watch: true,
  ignore_watch: ['node_modules', '__test__', 'logs'],
  instances: cpuCoreLength,
  error_file: './logs/err.log',
  out_file: './logs/out.log',
  log_date_format: 'YYYY-MM-DD HH:mm:ss Z', // Z 表示使用当前时区的时间格式
  combine_logs: true, // 多个实例，合并日志
  max_memory_restart: '300M', // 内存占用超过 300M ，则重启
}
