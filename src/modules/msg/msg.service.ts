import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MsgService {
  constructor(
    private readonly httpService: HttpService
  ){}

}
