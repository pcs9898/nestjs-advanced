import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledBatchService } from './scheduled-batch.service';
import { UserService } from '../user/user.service';

describe('ScheduledBatchService', () => {
  let service: ScheduledBatchService;
  let mockUserService: any;

  beforeEach(async () => {
    mockUserService = {
      removeUnVerifiedUserOver30Days: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduledBatchService,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<ScheduledBatchService>(ScheduledBatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call removeUnVerifiedUserOver30Days on UserService', async () => {
    mockUserService.removeUnVerifiedUserOver30Days.mockResolvedValue(undefined);

    await service.unVerifiedUserOver30DaysCleanUp();

    expect(mockUserService.removeUnVerifiedUserOver30Days).toHaveBeenCalled();
  });
});
