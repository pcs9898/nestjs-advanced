import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateVideoReqDto {
  @ApiProperty({ required: true })
  @MinLength(2)
  @MaxLength(30)
  @IsString()
  title: string;

  @ApiProperty({ type: 'string', required: true, format: 'binary' })
  video: any;
}

export class FindVideoReqDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;
}

export class DownloadVideoReqDto extends FindVideoReqDto {}
