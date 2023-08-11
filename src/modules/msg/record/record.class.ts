import { ApiProperty } from "@nestjs/swagger";
import { PageResponseOptionsDto } from "src/common/class/pageResponse.class";

class RecordInfo {
  @ApiProperty({ description: '模版名称' })
  name: string;

  @ApiProperty({ description: '内容' })
  content: string;
  
  @ApiProperty({ description: '所属分类' })
  categoryId: string;

  @ApiProperty({ description: '接受用户数' })
  userCount: number;

  @ApiProperty({ description: '处理状态' })
  status: string;

  @ApiProperty({ description: '失败原因' })
  reason: string;

  @ApiProperty({ description: '处理时间' })
  processTime: string;
}

export class RecordInfoPage extends PageResponseOptionsDto{

  @ApiProperty({
    type: [RecordInfo],
  })
  records: RecordInfo[];
}
