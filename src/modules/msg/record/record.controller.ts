import { Body, Controller, Post, Headers } from '@nestjs/common';
import { RecordService } from './record.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { RecordInfoDto } from './record.dto';
import { RecordInfoPage } from './record.class';

@Controller('msg/record')
export class RecordController {
  constructor(
    private recordService: RecordService,
  ) {
  }

  @Post('page')
  @ApiOperation({ summary: '消息日志列表' })
  @ApiOkResponse({ type: RecordInfoPage })
  recordPage(@Body() dto: RecordInfoDto) {
    return this.recordService.recordPage(dto);
  }
}
