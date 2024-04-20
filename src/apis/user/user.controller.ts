import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { FindUserResDto } from './dto/res.dto';
import {
  ApiGetItemResponse,
  ApiGetResponse,
} from 'src/common/decorator/swagger.decorator';
import { PageReqDto } from 'src/common/dto/req.dto';

import { FindUserReqDto } from './dto/req.dto';
import { AdminRolesGuard } from '../auth/guard/admin-roles.guard';
import { PageResDto } from 'src/common/dto/res.dto';

@ApiBearerAuth()
@ApiTags('User')
@ApiExtraModels(FindUserResDto, PageResDto, PageReqDto)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiGetItemResponse(PageResDto)
  @UseGuards(AdminRolesGuard)
  @Get()
  async findAll(
    @Query() data: PageReqDto,
  ): Promise<PageResDto<FindUserResDto>> {
    const users = await this.userService.findAll(data);

    return {
      page: data.page,
      size: data.size,
      items: users.map((user) => FindUserResDto.toDto(user)),
    };
  }

  @ApiGetResponse(FindUserResDto)
  @Get(':id')
  async findOne(@Param() { id }: FindUserReqDto): Promise<FindUserResDto> {
    const user = await this.userService.findOneById(id);
    return FindUserResDto.toDto(user);
  }
}
