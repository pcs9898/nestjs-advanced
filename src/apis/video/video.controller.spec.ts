import { Test } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { IAuthUser } from 'src/common/types/global-types';
import { UserRole } from 'src/common/enum/global-enum';
import { CreateVideoResDto } from './dto/res.dto';
import { InternalServerErrorException } from '@nestjs/common';

const result: CreateVideoResDto = { title: 'Test Video3', id: '1' };

describe('VideoController', () => {
  let videoController: VideoController;
  let videoService: VideoService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: {
            create: jest.fn().mockImplementation((dto) => {
              return { id: '1', title: dto.title };
            }),
          },
        },
      ],
    }).compile();

    videoController = moduleRef.get(VideoController);
    videoService = moduleRef.get(VideoService);
  });

  it('should be defined', () => {
    expect(videoController).toBeDefined();
  });

  it('should create', async () => {
    const mockFile = {
      fieldname: 'video',
      originalname: 'test.mp4',
      encoding: '7bit',
      mimetype: 'video/mp4',
      buffer: Buffer.from('test video data'),
      size: 5 * 1024 * 1024, // 1MB
    } as Express.Multer.File;

    const mockAuthUser: IAuthUser = {
      role: UserRole.Normal,
      sub: 'User1',
    };

    const mockCreateDto = { title: 'Test Video3', video: mockFile };

    expect(
      await videoController.create(mockFile, mockCreateDto, mockAuthUser),
    ).toEqual(result);
  });

  it('should handle error from create', async () => {
    const mockFile = {
      fieldname: 'video',
      originalname: 'test.mp4',
      encoding: '7bit',
      mimetype: 'video/mp4',
      buffer: Buffer.from('test video data'),
      size: 5 * 1024 * 1024, // 1MB
    } as Express.Multer.File;

    const mockAuthUser: IAuthUser = {
      role: UserRole.Normal,
      sub: 'User1',
    };

    const mockCreateDto = { title: 'Test Video3', video: mockFile };

    const error = new InternalServerErrorException(
      'Error during video creation',
    );

    jest.spyOn(videoService, 'create').mockRejectedValueOnce(error);

    try {
      await videoController.create(mockFile, mockCreateDto, mockAuthUser);
    } catch (e) {
      console.log(e);
      expect(e).toBe(error);
    }
  });
});
