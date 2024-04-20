import { IAuthUser } from 'src/common/types/global-types';

export interface IAuthServiceSaveHashedRefreshTokenOnRedis {
  user_id: string;
  hashedRefreshToken: string;
}

export interface IAuthServiceRestoreAccessToken extends IAuthUser {
  refreshToken: string;
}

export interface IAuthServiceVerifyEmail {
  user_id: string;
  authCode: number;
}
