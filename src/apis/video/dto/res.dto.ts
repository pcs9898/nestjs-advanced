import { ApiProperty } from '@nestjs/swagger';
import { Video } from '../entity/video.entity';

export class CreateVideoResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  title: string;

  static toDto({ id, title }: Video) {
    return { id, title };
  }
}

export class FindVideoUserDto {
  @ApiProperty({ required: true })
  user_id: string;

  @ApiProperty({ required: true })
  email: string;
}

export class FindVideoResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: true })
  user: FindVideoUserDto;

  static toDto({ id, title, user: { id: user_id, email } }: Video) {
    return { id, title, user: { user_id, email } };
  }
}
