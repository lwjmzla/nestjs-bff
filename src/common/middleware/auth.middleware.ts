import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// 白名单，跳过token验证
const whiteUrl: string[] = []; // !'/msg/record/page'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.headers?.usertoken) {
    next();
  } else {
    if (whiteUrl.includes(req.baseUrl)) {
      next();
    } else {
      throw new UnauthorizedException('没有访问权限，请先登录')
    }
  }
}
