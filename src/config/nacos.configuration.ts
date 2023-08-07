import { NacosManager } from './nacos.manage';

export const loadNacosConfig = async () => {
  const configManager = new NacosManager();
  return await configManager.getAllConfig();
};
