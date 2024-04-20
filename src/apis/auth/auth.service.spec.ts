// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
// import { BadRequestException } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { Redis } from 'ioredis';
// import { Repository } from 'typeorm';
// import { User } from '../user/entity/user.entity';
// import { UserAuth } from './entity/userAuth.entity';
// import { SignupReqDto } from './dto/req.dto';
// import { SignupResDto } from './dto/res.dto';
// import { UserRole } from 'src/common/enum/global-enum';

// describe('AuthService', () => {
//   let service: AuthService;
//   let jwtService: JwtService;
//   let configService: ConfigService;
//   let redis: Redis;
//   let userAuthRepository: Repository<UserAuth>;
//   let bcryptHash: jest.SpyInstance;
//   let queryRunner: any;
//   const SALT_ROUNDS = 10;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         { provide: JwtService, useValue: { sign: jest.fn() } },
//         { provide: ConfigService, useValue: { get: jest.fn() } },
//         {
//           provide: Redis,
//           useValue: { set: jest.fn(), get: jest.fn(), del: jest.fn() },
//         },
//         { provide: 'UserAuthRepository', useClass: Repository },
//       ],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//     jwtService = module.get<JwtService>(JwtService);
//     configService = module.get<ConfigService>(ConfigService);
//     redis = module.get<Redis>(Redis);
//     userAuthRepository = module.get<Repository<UserAuth>>('UserAuthRepository');

//     bcryptHash = jest.spyOn(bcrypt, 'hash');
//     queryRunner = {
//       manager: {
//         findOne: jest.fn(),
//         save: jest.fn(),
//         create: jest.fn(),
//       },
//       startTransaction: jest.fn(),
//       commitTransaction: jest.fn(),
//       rollbackTransaction: jest.fn(),
//       release: jest.fn(),
//     };
//   });

//   it('should sign up a user', async () => {
//     const dto: SignupReqDto = {
//       email: 'test@test.com',
//       password: 'password',
//       passwordConfirm: 'password',
//     };
//     const user: User = {
//       id: '1',
//       email: 'test@test.com',
//       password: 'hashedpassword',
//       role: UserRole.Normal,is_verified:false, created_at:Date,
//       updated_at:Date,
//     };
//     const signupResDto: SignupResDto = {
//       id: '1',
//       unVerifiedToken: 'unVerifiedToken',
//     };

//     queryRunner.manager.findOne.mockResolvedValueOnce(null);
//     bcryptHash.mockResolvedValueOnce('hashedpassword');
//     queryRunner.manager.save.mockResolvedValueOnce(user);
//     jwtService.sign.mockReturnValueOnce('unVerifiedToken');

//     const result = await service.signup(dto);

//     expect(queryRunner.manager.findOne).toHaveBeenCalledWith(User, {
//       email: dto.email,
//     });
//     expect(bcryptHash).toHaveBeenCalledWith(dto.password, SALT_ROUNDS);
//     expect(queryRunner.manager.save).toHaveBeenCalledWith(user);
//     expect(queryRunner.commitTransaction).toHaveBeenCalled();
//     expect(result).toEqual(signupResDto);
//   });
// });
