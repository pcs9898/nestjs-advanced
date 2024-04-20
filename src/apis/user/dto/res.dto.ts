import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class FindUserResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  role: string;

  @ApiProperty({ required: true })
  created_at: string;

  static toDto({ id, email, role, created_at }: User) {
    return {
      id,
      email,
      role: role.toString(),
      created_at: created_at.toISOString(),
    };
  }
}
