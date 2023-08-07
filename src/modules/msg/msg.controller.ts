import { Body, Controller, Inject, LoggerService, Post } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MsgService } from './msg.service';

@Controller('msg')
export class MsgController {
  constructor(
    private msgService: MsgService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {
    this.logger.log('Msg Controller init')
  }

}
