import { SetMetadata } from '@nestjs/common';
import { TRANSFORM_PUBLIC_KEY_METADATA } from '../contants/decorator.contants';

/**
 * !不校验token
 */
export const Public = () => SetMetadata(TRANSFORM_PUBLIC_KEY_METADATA, true);
