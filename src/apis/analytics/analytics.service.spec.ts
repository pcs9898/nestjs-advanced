import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { VideoService } from '../video/video.service';
import { MailService } from '../mail/mail.service';

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;
  let mockVideoService: any;
  let mockMailService: any;

  const findTop5DownloadVideosResult = [
    {
      id: 'c43c8a9d-f75d-4dd8-88f3-30fcdfdb4748',
      title: 'hi2',
      mimetype: 'video/mp4',
      download_cnt: 1,
      created_at: new Date('2024-04-21T02:34:15.093Z'),
      updated_at: new Date('2024-04-21T09:45:23.358Z'),
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
    {
      id: '703cd9cf-c7e1-4541-aa47-cd6e2e70897b',
      title: 'hi3',
      mimetype: 'video/mp4',
      download_cnt: 0,
      created_at: new Date('2024-04-21T11:10:05.911Z'),
      updated_at: new Date('2024-04-21T11:10:05.911Z'),
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
  ];

  beforeEach(async () => {
    mockVideoService = {
      findTop5DownloadVideos: jest
        .fn()
        .mockResolvedValue(findTop5DownloadVideosResult),
    };

    mockMailService = {
      sendAnalyticsServiceFindTop5downloadVideos: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: VideoService, useValue: mockVideoService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    analyticsService = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(analyticsService).toBeDefined();
  });

  it('it should send AnalyticsServiceFindTop5downloadVideos mail', async () => {
    // give

    // when
    await analyticsService.findTop5DownloadVideos();

    // then
    expect(mockVideoService.findTop5DownloadVideos).toHaveBeenCalled();
    expect(
      mockMailService.sendAnalyticsServiceFindTop5downloadVideos,
    ).toHaveBeenCalledWith(findTop5DownloadVideosResult);
  });
});
