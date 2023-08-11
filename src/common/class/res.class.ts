
import {
  ApiProperty,
} from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty()
  readonly data: T;

  @ApiProperty()
  readonly code: number;

  @ApiProperty()
  readonly msg: string;

  @ApiProperty()
  readonly success: boolean;

  constructor({ code = 200, data, msg = 'success', success = true }) {
    this.code = code;
    this.data = data;
    this.msg = msg;
    this.success = success
  }
}


