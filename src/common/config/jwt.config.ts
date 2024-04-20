import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret: process.env.PASSPORT_JWT_ACCESS_SECRET_KEY || 'accesssecret',
  refreshSecret: process.env.PASSPORT_JWT_REFRESH_SECRET_KEY || 'refreshsecret',
  unverifiedSecret:
    process.env.PASSPORT_JWT_UNVERIFIED_SECRET_KEY || 'unverifiedsecret',
}));
