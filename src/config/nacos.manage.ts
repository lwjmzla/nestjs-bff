/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as os from 'os';
import * as nacos from 'nacos';
import * as yaml from 'js-yaml';
import { AxiosRequestConfig } from "axios";
import { getDotenvObj } from './dotenv';
const dotenvObj = getDotenvObj()

export class NacosManager {
  private ip: string;
  private client: any;
  private namingClient;
  private serviceName = process.env.NACOS_SERVICENAME
  private DATA_ID = process.env.NACOS_DATA_ID;
  private GROUP = process.env.NACOS_GROUP;
  private NACOS_NAMESPACE = process.env.NACOS_NAMESPACE;
  private NACOS_ADDRESS = process.env.NACOS_ADDRESS;

  constructor() {
    this.getClient();
    this.ip = this.getIpAddress();
  }

  private async getClient(): Promise<void> {
    // !获取nacos配置用
    this.client = new nacos.NacosConfigClient({
      serverAddr: this.NACOS_ADDRESS,
      namespace: this.NACOS_NAMESPACE,
      requestTimeout: 6000,
      // @ts-ignore
      username: process.env.NACOS_USERNAME, // !巨坑
      password: process.env.NACOS_PASSWORD
    });
    const logger = console;
    this.namingClient = new nacos.NacosNamingClient({
      // @ts-ignore
      logger: { info: () => '', debug: () => '', warn: () => '' },
      serverList: this.NACOS_ADDRESS,
      namespace: this.NACOS_NAMESPACE,
      // @ts-ignore
      username: process.env.NACOS_USERNAME,
      password: process.env.NACOS_PASSWORD
    });
    const content_yaml = await this.client.getConfig(this.DATA_ID, this.GROUP);
    const content = yaml.load(content_yaml) || {};
    const port = content.port || 7000
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
    let content = yaml.load(content_yaml) || {};
    
    await this.setInsInfo('cmn-base-msg', content)
    await this.setInsInfo('cmn-base-sys', content)
    await this.setInsInfo('cmn-base-activiti', content)
    content = { ...content, ...dotenvObj }
    console.log(content)
    return content;
  }

  async setInsInfo(serviceName: string, content: Record<string, any>) {
    const instances = await this.namingClient.getAllInstances(serviceName)
    if (instances?.length) {
      const insType = serviceName.replace('cmn-base-', '') + 'Ins'
      content[insType] = {
        baseUrl: `http://${serviceName}` 
      }
    }
  }

  async selectOneHealthyInstance(serviceName: string, groupName?: string, clusters?: string) {
    const instances = await this.namingClient.selectInstances(serviceName, groupName, clusters, true);
    let totalWeight = 0;
    for (const instance of instances) {
        totalWeight += instance.weight;
    }
    let pos = Math.random() * totalWeight;
    for (const instance of instances) {
        if (instance.weight) {
            pos -= instance.weight;
            if (pos <= 0) {
                return instance
            }
        }
    }
    throw new Error(`Not found healthy service ${serviceName}!`);
  }

  axiosRequestInterceptor(matchReg: RegExp) {
    return async (config: AxiosRequestConfig) => {
      console.log(config.url)
        const results = /(?<=:\/\/)[a-zA-Z\.\-_0-9]+(?=\/|$)/.exec(config.url);
        if (results && results.length) {
            const serviceName = results[0];
            if (matchReg.test(serviceName)) {
              //const realServiceName = serviceName.split('.')[0]
              const service = await this.selectOneHealthyInstance(serviceName);
              config.url = config.url.replace(serviceName, `${service.ip}:${service.port}`);
              console.log(config.url)
            }
        }
        return config;
    };
  }
}
