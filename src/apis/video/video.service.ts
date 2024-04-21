import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entity/video.entity';
import { DataSource, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { IAuthUser } from 'src/common/types/global-types';
import { join } from 'path';
import { writeFile } from 'node:fs/promises';
import { PageReqDto } from 'src/common/dto/req.dto';
import { DownloadVideoReqDto, FindVideoReqDto } from './dto/req.dto';
import { stat } from 'fs/promises';
import { createReadStream } from 'fs';

interface IVideoServiceCreate {
  user: IAuthUser;
  title: string;
  file: Express.Multer.File;
}

@Injectable()
export class VideoService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    private readonly userService: UserService,
  ) {}

  async create({ user, title, file }: IVideoServiceCreate) {
    const { mimetype, originalname, buffer } = file;
    const extension = originalname.split('.')[1];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const foundUser = await this.userService.findOneById(user.id);
      if (!foundUser) throw new NotFoundException('User not found');

      const foundVideo = await this.videoRepository.findOne({
        where: { title },
      });

      if (foundVideo) throw new ConflictException('Title already exists');

      const video = await this.videoRepository.save(
        this.videoRepository.create({ title, mimetype, user: foundUser }),
      );

      await this.uploadVideo(video.id, extension, buffer);

      await queryRunner.commitTransaction();

      return video;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error during video creation:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error during video creation',
          error.message,
        );
      }
    } finally {
      await queryRunner.release();
    }
  }

  private async uploadVideo(id: string, extension: string, buffer: Buffer) {
    const filePath = join(process.cwd(), 'video-storage', `${id}.${extension}`);
    try {
      await writeFile(filePath, buffer);
    } catch (error) {
      console.error('Error during video upload:', error);
      throw new InternalServerErrorException(
        'Error during video upload',
        error.message,
      );
    }
  }

  async findAll({ page, size }: PageReqDto) {
    const videos = await this.videoRepository.find({
      relations: ['user'],
      skip: (page - 1) * size,
      take: size,
    });

    return videos;
  }

  async findOne({ id }: FindVideoReqDto) {
    const video = await this.videoRepository.findOne({
      relations: ['user'],
      where: {
        id,
      },
    });

    console.log(video);

    return video;
  }

  async download({ id }: DownloadVideoReqDto) {
    const video = await this.videoRepository.findOneBy({ id });
    if (!video) throw new NotFoundException('Video not found');

    await this.videoRepository.update(
      { id },
      { download_cnt: () => 'download_cnt+1' },
    );

    const { mimetype } = video;
    const extension = mimetype.split('/')[1];
    const videoPath = join(
      process.cwd(),
      'video-storage',
      `${id}.${extension}`,
    );
    const { size } = await stat(videoPath);
    const stream = createReadStream(videoPath);

    return { stream, mimetype, size };
  }

  async findTop5Download() {
    const videos = await this.videoRepository.find({
      relations: ['user'],
      order: {
        download_cnt: 'DESC',
      },
      take: 5,
    });

    return videos;
  }
}
