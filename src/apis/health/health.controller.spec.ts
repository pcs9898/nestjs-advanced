import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheckStatus,
  HealthCheckResult,
} from '@nestjs/terminus';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthService: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthCheckService,
        TypeOrmHealthIndicator,
        // Mock HealthCheckExecutor
        {
          provide: HealthCheckExecutor,
          useValue: {
            execute: jest.fn(),
          },
        },
        // Mock TERMINUS_ERROR_LOGGER
        {
          provide: 'TERMINUS_ERROR_LOGGER',
          useValue: jest.fn(),
        },
        // Mock TERMINUS_LOGGER
        {
          provide: 'TERMINUS_LOGGER',
          useValue: jest.fn(),
        },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    healthService = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should return database health check result', async () => {
    const result: HealthCheckResult = {
      status: 'ok' as HealthCheckStatus,
      info: { database: { status: 'up' } },
      details: { database: { status: 'up', message: 'database is up' } },
    };
    jest
      .spyOn(healthService, 'check')
      .mockImplementation(() => Promise.resolve(result));

    expect(healthController.check()).resolves.toEqual(result);
  });
});
