import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;
  let mockJwtService;
  let mockLogger: any;

  beforeEach(async () => {
    mockAuthService = {
      signup: jest.fn().mockResolvedValue({ message: 'Signup successful' }),
      signin: jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }),
      verifyEmail: jest.fn().mockResolvedValue({ message: 'Email verified' }),
      resendAuthCode: jest
        .fn()
        .mockResolvedValue({ message: 'Auth code resent' }),
      restoreRefreshToken: jest.fn().mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      }),
      signout: jest.fn().mockResolvedValue({ message: 'Signout successful' }),
      restoreAccessToken: jest.fn().mockResolvedValue({
        // Add this line
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      }),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    mockLogger = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: Logger, useValue: mockLogger }, // Provide mock Logger
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call signup on AuthService', async () => {
    const signupReqDto = {
      /* fill with appropriate data */
      email: 'a@a.com',
      password: '1234',
      passwordConfirm: '1234',
    };
    const result = await controller.signup(signupReqDto);

    expect(mockAuthService.signup).toHaveBeenCalledWith(signupReqDto);
    expect(result).toEqual({ message: 'Signup successful' });
  });

  it('should call signin on AuthService', async () => {
    const signinReqDto = {
      /* fill with appropriate data */
      email: 'a@a.com',
      password: '1234',
    };
    const result = await controller.signin(signinReqDto);

    expect(mockAuthService.signin).toHaveBeenCalledWith(signinReqDto);
    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('should call verifyEmail on AuthService', async () => {
    const verifyEmailReqDto = {
      /* fill with appropriate data */
      authCode: 123456,
    };
    const authUser = { id: '1' }; // replace with appropriate data
    const result = await controller.verifyEmail(authUser, verifyEmailReqDto);

    expect(mockAuthService.verifyEmail).toHaveBeenCalledWith({
      user_id: authUser.id,
      authCode: verifyEmailReqDto.authCode,
    });
    expect(result).toEqual({ message: 'Email verified' });
  });

  it('should call resendAuthCode on AuthService', async () => {
    const authUser = { id: '1' }; // replace with appropriate data
    const result = await controller.resendAuthCode(authUser);

    expect(mockAuthService.resendAuthCode).toHaveBeenCalledWith({
      user_id: authUser.id,
    });
    expect(result).toEqual({ message: 'Auth code resent' });
  });

  it('should call restoreRefreshToken on AuthService', async () => {
    const result = await controller.restoreRefreshToken(
      { refreshToken: 'old' },
      { id: '1' },
    );

    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
  });

  it('should call signout on AuthService', async () => {
    const authUser = { id: '1' }; // replace with appropriate data
    const result = await controller.signout(authUser);

    expect(mockAuthService.signout).toHaveBeenCalledWith({
      user_id: authUser.id,
    });
    expect(result).toEqual({ message: 'Signout successful' });
  });
});
