import { PageResDto } from './../../common/dto/res.dto';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  Res,
  StreamableFile,
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
import {
  CreateVideoReqDto,
  DownloadVideoReqDto,
  FindVideoReqDto,
} from './dto/req.dto';
import { VideoService } from './video.service';
import {
  ApiGetItemResponse,
  ApiPostResponse,
} from 'src/common/decorator/swagger.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { IAuthUser } from 'src/common/types/global-types';
import { SkipThrottle } from '@nestjs/throttler';
import { PageReqDto } from 'src/common/dto/req.dto';
import { Response } from 'express';

@ApiTags('Video')
@ApiExtraModels(CreateVideoResDto, FindVideoResDto, FindVideoReqDto)
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiPostResponse(CreateVideoResDto)
  @Post('upload')
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
    const video = await this.videoService.create({ user, title, file });

    console.log(video);
    const response = CreateVideoResDto.toDto(video);

    return response;
  }

  @ApiBearerAuth()
  @ApiGetItemResponse(FindVideoResDto)
  @SkipThrottle()
  @Get()
  async findAll(
    @Query() data: PageReqDto,
  ): Promise<PageResDto<FindVideoResDto>> {
    const videos = await this.videoService.findAll(data);

    return {
      page: data.page,
      size: data.size,
      items: videos.map((video) => FindVideoResDto.toDto(video)),
    };
  }

  @ApiBearerAuth()
  @ApiGetItemResponse(FindVideoResDto)
  @SkipThrottle()
  @Get(':id')
  async findOne(@Param() { id }: FindVideoReqDto): Promise<FindVideoResDto> {
    const video = await this.videoService.findOne({ id });

    const response = FindVideoResDto.toDto(video);

    return response;
  }

  @ApiBearerAuth()
  @Get(':id/download')
  async download(
    @Param() { id }: DownloadVideoReqDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { mimetype, stream, size } = await this.videoService.download({ id });

    res.set({
      'Content-Type': mimetype,
      'Content-Length': size,
      'Content-Disposition': 'attachment',
    });

    return new StreamableFile(stream);
  }
}
