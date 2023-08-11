import { Body, Controller, Post, Headers, Get, Query } from '@nestjs/common';
import { RecordService } from './record.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { RecordInfoDto } from './record.dto';
import { RecordInfoPage } from './record.class';
import { Keep } from 'src/common/decorators/keep.decorator';

@Controller('msg/record')
export class RecordController {
  constructor(
    private recordService: RecordService,
  ) {
  }

  @Post('page')
  @Keep()
  @ApiOperation({ summary: '消息日志列表' })
  @ApiOkResponse({ type: RecordInfoPage })
  recordPage(@Body() dto: RecordInfoDto) {
    return this.recordService.recordPage(dto);
  }

  @Get()
  getPage(@Query() dto) {
    return [{ name: 'lwj' }]
  }
}
