import { Body, Controller, Post, Headers } from '@nestjs/common';
import { RecordService } from './record.service';

@Controller('msg/record')
export class RecordController {
  constructor(
    private recordService: RecordService,
  ) {
  }

  @Post('page')
  recordPage(@Body() body) {
    return this.recordService.recordPage(body);
  }
}
