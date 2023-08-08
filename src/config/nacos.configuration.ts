import { NacosManager } from './nacos.manage';

export const configManager = new NacosManager();

export const loadNacosConfig = async () => {
  return await configManager.getAllConfig();
};
