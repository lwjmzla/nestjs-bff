import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PageOptionsDto {
  @ApiProperty({
    description: '页码',
    //required: false,
    //default: 1,
  })
  @IsInt()
  @Min(1)
  current: number

  @ApiProperty({
    description: '当前页size',
  })
  @IsInt()
  @Min(1)
  size: number
}
