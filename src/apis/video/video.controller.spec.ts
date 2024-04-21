import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import * as fs from 'fs';
import { Response } from 'express';
import { StreamableFile } from '@nestjs/common';

describe('VideoController', () => {
  let videoController: VideoController;
  let mockVideoService: any;

  const videoData = {
    mimetype: 'video/mp4',
    stream: fs.createReadStream('path/to/destination/test.mp4'), // Replace 'fs.createReadStream' with the actual path to the video file
    size: 123456,
  };

  beforeEach(async () => {
    mockVideoService = {
      create: jest.fn().mockResolvedValue({
        title: 'Test Video',
        mimetype: 'video/mp4',
        user: {
          id: '55f09625-fea9-49a9-a0cc-d311e320e12e',
          email: 'aa@a.com',
          password:
            '$2b$10$Chlm6Tk5y74ZGewxYzn3YOGI3pagt4t1zvauMvmoCwfhBv3DQ6WMi',
          role: 'ADMIN',
          is_verified: true,
          created_at: new Date('2024-04-11T17:13:39.278Z'),
          updated_at: new Date('2024-04-13T06:52:40.224Z'),
        },
        id: 'b7c4c203-4d51-4bd0-b791-389f81f7b467',
        download_cnt: 0,
        created_at: new Date('2024-04-21T11:38:42.911Z'),
        updated_at: new Date('2024-04-21T11:38:42.911Z'),
      }),
      findAll: jest.fn().mockResolvedValue([
        {
          id: '2e6bbd60-7f3d-4064-9b66-951ce9b4b613',
          title: '3hh2',
          mimetype: 'video/mp4',
          download_cnt: 0,
          created_at: new Date('2024-04-21T11:13:43.475Z'),
          updated_at: new Date('2024-04-21T11:13:43.475Z'),
          user: {
            id: '55f09625-fea9-49a9-a0cc-d311e320e12e',
            email: 'aa@a.com',
            password:
              '$2b$10$Chlm6Tk5y74ZGewxYzn3YOGI3pagt4t1zvauMvmoCwfhBv3DQ6WMi',
            role: 'ADMIN',
            is_verified: true,
            created_at: new Date('2024-04-11T17:13:39.278Z'),
            updated_at: new Date('2024-04-13T06:52:40.224Z'),
          },
        },
        {
          id: '13a19942-6f08-48f9-8f56-0d051df31e55',
          title: 'hh2',
          mimetype: 'video/mp4',
          download_cnt: 0,
          created_at: new Date('2024-04-21T11:13:11.544Z'),
          updated_at: new Date('2024-04-21T11:13:11.544Z'),
          user: {
            id: '55f09625-fea9-49a9-a0cc-d311e320e12e',
            email: 'aa@a.com',
            password:
              '$2b$10$Chlm6Tk5y74ZGewxYzn3YOGI3pagt4t1zvauMvmoCwfhBv3DQ6WMi',
            role: 'ADMIN',
            is_verified: true,
            created_at: new Date('2024-04-11T17:13:39.278Z'),
            updated_at: new Date('2024-04-13T06:52:40.224Z'),
          },
        },
        {
          id: '43e11494-c967-4f82-a311-40bbde0323d9',
          title: 'hi4',
          mimetype: 'video/mp4',
          download_cnt: 0,
          created_at: new Date('2024-04-21T11:11:12.616Z'),
          updated_at: new Date('2024-04-21T11:11:12.616Z'),
          user: {
            id: '55f09625-fea9-49a9-a0cc-d311e320e12e',
            email: 'aa@a.com',
            password:
              '$2b$10$Chlm6Tk5y74ZGewxYzn3YOGI3pagt4t1zvauMvmoCwfhBv3DQ6WMi',
            role: 'ADMIN',
            is_verified: true,
            created_at: new Date('2024-04-11T17:13:39.278Z'),
            updated_at: new Date('2024-04-13T06:52:40.224Z'),
          },
        },
      ]),
      findOne: jest.fn().mockResolvedValue({
        id: '2e6bbd60-7f3d-4064-9b66-951ce9b4b613',
        title: '3hh2',
        mimetype: 'video/mp4',
        download_cnt: 0,
        created_at: new Date('2024-04-21T11:13:43.475Z'),
        updated_at: new Date('2024-04-21T11:13:43.475Z'),
        user: {
          id: '55f09625-fea9-49a9-a0cc-d311e320e12e',
          email: 'aa@a.com',
          password:
            '$2b$10$Chlm6Tk5y74ZGewxYzn3YOGI3pagt4t1zvauMvmoCwfhBv3DQ6WMi',
          role: 'ADMIN',
          is_verified: true,
          created_at: new Date('2024-04-11T17:13:39.278Z'),
          updated_at: new Date('2024-04-13T06:52:40.224Z'),
        },
      }),
      download: jest.fn().mockResolvedValue(videoData),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: mockVideoService,
        },
      ],
    }).compile();

    videoController = module.get<VideoController>(VideoController);
  });

  it('should be defined', () => {
    expect(videoController).toBeDefined();
  });

  describe('upload', () => {
    it('should upload video', async () => {
      // give
      const result = {
        id: 'b7c4c203-4d51-4bd0-b791-389f81f7b467',
        title: 'Test Video',
      };
      const file = {
        fieldname: 'video',
        originalname: 'test.mp4',
        encoding: 'utf-8',
        mimetype: 'video/mp4',
        size: 123456,
        destination: '/path/to/destination',
        filename: 'test.mp4',
        path: '/path/to/destination/test.mp4',
        stream: fs.createReadStream('path/to/destination/test.mp4'), // Replace 'fs.createReadStream' with the actual path to the video file
        buffer: Buffer.from('fsdfs'), // Change the buffer type to Buffer
      };
      const title = 'Test Video';
      const user = {
        id: '55f09625-fea9-49a9-a0cc-d311e320e12e',
      };

      // when
      const response = await videoController.upload(
        file,
        { title, video: file },
        user,
      );

      // then
      expect(response).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of videos', async () => {
      // give
      const page = 1;
      const size = 3;
      const result = [
        {
          id: '2e6bbd60-7f3d-4064-9b66-951ce9b4b613',
          title: '3hh2',
          user: {
            user_id: '55f09625-fea9-49a9-a0cc-d311e320e12e',
            email: 'aa@a.com',
          },
        },
        {
          id: '13a19942-6f08-48f9-8f56-0d051df31e55',
          title: 'hh2',
          user: {
            user_id: '55f09625-fea9-49a9-a0cc-d311e320e12e',
            email: 'aa@a.com',
          },
        },
        {
          id: '43e11494-c967-4f82-a311-40bbde0323d9',
          title: 'hi4',
          user: {
            user_id: '55f09625-fea9-49a9-a0cc-d311e320e12e',
            email: 'aa@a.com',
          },
        },
      ];

      // when
      const response = await videoController.findAll({ page, size });

      // then
      expect(response.items).toHaveLength(3);
      expect(response).toEqual({
        page,
        size,
        items: result,
      });
    });
  });

  describe('findOne', () => {
    it('should return a video', async () => {
      // give
      const result = {
        id: '2e6bbd60-7f3d-4064-9b66-951ce9b4b613',
        title: '3hh2',
        user: {
          user_id: '55f09625-fea9-49a9-a0cc-d311e320e12e',
          email: 'aa@a.com',
        },
      };

      // when
      const response = await videoController.findOne({
        id: '2e6bbd60-7f3d-4064-9b66-951ce9b4b613',
      });

      // then
      expect(response).toEqual(result);
    });
  });

  describe('download', () => {
    it('should download a video', async () => {
      // give
      const id = 'b7c4c203-4d51-4bd0-b791-389f81f7b467';
      const videoData = {
        mimetype: 'video/mp4',
        stream: fs.createReadStream('path/to/destination/test.mp4'), // Replace 'fs.createReadStream' with the actual path to the video file
        size: 123456,
      };
      const res = {
        set: jest.fn(),
      } as unknown as Response;

      // when
      const response = await videoController.download({ id }, res);

      // then
      expect(res.set).toHaveBeenCalledWith({
        'Content-Type': videoData.mimetype,
        'Content-Length': videoData.size,
        'Content-Disposition': 'attachment',
      });
      expect(response).toBeInstanceOf(StreamableFile);
    });
  });
});
