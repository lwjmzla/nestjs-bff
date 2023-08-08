import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RecordService {
  private baseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ){
    this.baseUrl = this.configService.get('msgIns.baseUrl') // ! http://192.168.1.3:19005
  }

  async recordPage(body) {
    console.log(body)
    const recordPage = this.httpService.post(
      // 'http://183.6.74.109:38007/system/api/msg-api/msg/record/page',
      this.baseUrl + '/msg/record/page',
      body,
    );
    //console.log(recordPage)
    const { data }: any = await lastValueFrom(recordPage);
    //console.log(data)
    return data
  }
}
