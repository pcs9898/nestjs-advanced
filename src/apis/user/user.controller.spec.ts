import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: any;
  const findAllServiceResponse = new Array(10).fill({
    id: 'abe55c4e-e20f-4787-a331-efdb74b2e07b',
    email: 'Novella_Wuckert82@yahoo.com',
    password: 'urrgsUIWODaoANH',
    role: 'NORMAL',
    is_verified: false,
    created_at: new Date('2024-04-14T13:30:13.605Z'),
    updated_at: new Date('2024-04-14T13:30:13.605Z'),
  });

  beforeEach(async () => {
    mockUserService = {
      findAll: jest.fn().mockResolvedValue(findAllServiceResponse),
      findOneById: jest.fn().mockResolvedValue({
        id: 'abe55c4e-e20f-4787-a331-efdb74b2e07b',
        email: 'Novella_Wuckert82@yahoo.com',
        password: 'urrgsUIWODaoANH',
        role: 'NORMAL',
        is_verified: false,
        created_at: new Date('2024-04-14T13:30:13.605Z'),
        updated_at: new Date('2024-04-14T13:30:13.605Z'),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // give
      const result = new Array(10).fill({
        id: 'abe55c4e-e20f-4787-a331-efdb74b2e07b',
        email: 'Novella_Wuckert82@yahoo.com',
        role: 'NORMAL',
        created_at: new Date('2024-04-14T13:30:13.605Z').toISOString(),
      });

      // when
      const response = await controller.findAll({ page: 1, size: 10 });

      // then
      expect(response.items).toHaveLength(10);
      expect(response).toEqual({
        page: 1,
        size: 10,
        items: result,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      // give
      const result = {
        id: 'abe55c4e-e20f-4787-a331-efdb74b2e07b',
        email: 'Novella_Wuckert82@yahoo.com',
        role: 'NORMAL',
        created_at: new Date('2024-04-14T13:30:13.605Z').toISOString(),
      };

      // when
      const response = await controller.findOne({ id: '1' });

      // then
      expect(response).toEqual(result);
    });
  });
});
