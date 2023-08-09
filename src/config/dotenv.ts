import * as dotenv from 'dotenv';

export const getDotenvObj = () => {
  const envFilePath = `.env.${process.env.NODE_ENV||'development'}`
  const commonEnvObj = dotenv.config({ path: '.env' }).parsed
  const currentEnvObj = dotenv.config({ path: envFilePath }).parsed
  const dotenvObj = { ...commonEnvObj, ...currentEnvObj }
  return dotenvObj
}