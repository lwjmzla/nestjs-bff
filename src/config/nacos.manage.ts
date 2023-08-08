/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as os from 'os';
import * as nacos from 'nacos';
import * as dayjs from 'dayjs';
import * as yaml from 'js-yaml';

export class NacosManager {
  private ip: string;
  private client: any;
  private namingClient;
  private serviceName = 'cmn-base-bff'
  private DATA_ID = 'cmn-sys-bff-test.yml';
  private GROUP = 'DEFAULT_GROUP';
  private NAMESPACE = 'test';
  private NACOS_ADDRESS = '192.168.1.210:8848';

  constructor() {
    this.getClient();
    this.ip = this.getIpAddress();
  }

  private async getClient(): Promise<void> {
    // !获取nacos配置用
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
      // @ts-ignore
      logger: { info: () => '', debug: () => '' },
      serverList: this.NACOS_ADDRESS,
      namespace: this.NAMESPACE,
      // @ts-ignore
      username: 'nacos', // !巨坑
      password: 'nacos'
    });
    await this.namingClient.ready();
    // !注册nacos服务，获取当前服务下的实例
    await this.namingClient.registerInstance(this.serviceName, {
      ip: this.ip,
      port,
      metadata: {
        componentName: 'node-bff',
        address: `${this.ip}:${port}`
      }
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
    const content = yaml.load(content_yaml) || {};

    const msgInstances = await this.namingClient.getAllInstances('cmn-base-msg')
    const sysInstances = await this.namingClient.getAllInstances('cmn-base-sys')
    const flowInstances = await this.namingClient.getAllInstances('cmn-base-activiti')
    if (msgInstances?.length) {
      this.setInsInfo(content, 'msgIns', msgInstances)
    }
    if (sysInstances?.length) {
      this.setInsInfo(content, 'sysIns', sysInstances)
    }
    if (flowInstances?.length) {
      this.setInsInfo(content, 'flowIns', flowInstances)
    }
    console.log(content)
    return content;
  }

  //
  private setInsInfo(content, insType, instances: {ip: string, port: number}[]) {
    content[insType] = {
      ip: instances[0].ip,
      port: instances[0].port,
      baseUrl: 'http://' + instances[0].ip + ':' + instances[0].port,
    }
    return content
  }
}
