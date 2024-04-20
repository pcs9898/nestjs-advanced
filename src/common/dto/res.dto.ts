import { ApiProperty } from '@nestjs/swagger';

export class PageResDto<T> {
  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;

  items: T[];
}
