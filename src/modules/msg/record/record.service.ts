import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RecordService {
  constructor(
    private readonly httpService: HttpService
  ){

  }

  async recordPage(body) {
    console.log(body)
    const recordPage = this.httpService.post(
      'http://183.6.74.109:38007/system-csn/api/msg-api/msg/record/page',
      body,
    );
    //console.log(recordPage)
    const { data }: any = await lastValueFrom(recordPage);
    //console.log(data)
    return data
  }
}
