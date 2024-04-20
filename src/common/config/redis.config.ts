import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6739,
  password: process.env.REDIS_PASSWD || 'root',
  number: process.env.REDIS_DB_NUMBER || 1,
}));
