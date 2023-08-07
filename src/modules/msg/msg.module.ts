import { Module } from '@nestjs/common';
import { MsgController } from './msg.controller';
import { MsgService } from './msg.service';
import { HttpModule } from '@nestjs/axios';
import { RecordModule } from './record/record.module';

@Module({
  imports: [HttpModule, RecordModule],
  controllers: [MsgController],
  providers: [MsgService]
})
export class MsgModule {}
