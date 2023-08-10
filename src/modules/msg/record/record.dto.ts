import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PageOptionsDto } from "src/common/dto/page.dto";

export class RecordInfoDto extends PageOptionsDto{
  @ApiPropertyOptional({ description: '分类ID' })
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({ description: '模版名称' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '消息内容' })
  @IsString()
  content: string;

  @ApiProperty({ description: '处理状态', required: false })
  @IsString()
  status: string;

  // @Type(() => Photo)
  // photos: Photo[];
}
