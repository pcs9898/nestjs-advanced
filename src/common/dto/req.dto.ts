import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PageReqDto {
  @ApiPropertyOptional({ description: 'page, default =1' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'data amount per page, min:0, max:50' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  size?: number = 50;
}
