import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import { CreateVideoResDto, FindVideoResDto } from './dto/res.dto';
import { CreateVideoReqDto, FindVideoReqDto } from './dto/req.dto';
import { VideoService } from './video.service';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { IAuthUser } from 'src/common/types/global-types';

@ApiTags('Video')
@ApiExtraModels(CreateVideoResDto, FindVideoResDto, FindVideoReqDto)
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiPostResponse(CreateVideoResDto)
  @Post()
  @UseInterceptors(FileInterceptor('video'))
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'mp4' })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Body() { title }: CreateVideoReqDto,
    @GetUser() user: IAuthUser,
  ): Promise<CreateVideoResDto> {
    return await this.videoService.create({ user, title, file });
  }
}
