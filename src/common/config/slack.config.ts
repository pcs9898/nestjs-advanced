import { registerAs } from '@nestjs/config';

export default registerAs('slack', () => ({
  webhook: process.env.SLACK_WEBHOOK || 'hi',
}));
