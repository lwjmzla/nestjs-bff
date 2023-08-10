import { ApiProperty } from "@nestjs/swagger";

export class PageResponseOptionsDto {
  @ApiProperty({ description: '页码' })
  current: number;

  @ApiProperty({ description: '当前页size' })
  size: number;

  @ApiProperty({ description: '总页数' })
  pages: number;

  @ApiProperty({ description: '总条数' })
  total: number;
}
