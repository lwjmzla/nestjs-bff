/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as os from 'os';
import * as nacos from 'nacos';
import * as dayjs from 'dayjs';
import * as yaml from 'js-yaml';

export class NacosManager {
  private ip: string;
  private client: any;
  private namingClient;
  private DATA_ID = 'cmn-sys-bff-test.yml';
  private GROUP = 'DEFAULT_GROUP';
  private NAMESPACE = 'test';
  private NACOS_ADDRESS = '192.168.1.210:8848';

  constructor() {
    this.getClient();
    this.ip = this.getIpAddress();
  }

  private async getClient(): Promise<void> {
    this.client = new nacos.NacosConfigClient({
      serverAddr: this.NACOS_ADDRESS,
      namespace: this.NAMESPACE,
      requestTimeout: 6000,
      // @ts-ignore
      username: 'nacos', // !巨坑
      password: 'nacos'
    });
    const port = 7000
    const logger = console;
    this.namingClient = new nacos.NacosNamingClient({
      logger,
      serverList: this.NACOS_ADDRESS,
      namespace: this.NAMESPACE,
      // @ts-ignore
      username: 'nacos', // !巨坑
      password: 'nacos'
    });
    await this.namingClient.ready();
    // 注册nacos服务
    await this.namingClient.registerInstance('cmn-base-bff', {
      ip: this.ip,
      port,
      // // @ts-ignore
      // metadata: {
      //   'preserved.register.source': 'node-bff',
      //   'startup.time': dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      // },
    });
    console.log(`[Nacos] Nacos服务实例注册成功: ${this.ip}:${port}`);
  }

  //获取本机ip
  private getIpAddress(): string {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
      const iface = interfaces[devName];
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (
          alias.family === 'IPv4' &&
          alias.address !== '127.0.0.1' &&
          !alias.internal
        ) {
          return alias.address;
        }
      }
    }
  }

  public async getAllConfig(): Promise<any> {
    const content_yaml = await this.client.getConfig(this.DATA_ID, this.GROUP);
    const content = yaml.load(content_yaml);
    console.log(content)
    const allInstances = await this.namingClient.getAllInstances('cmn-base-bff')
    console.log(allInstances)
    return content;
  }
}
