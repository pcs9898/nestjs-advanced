import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  senderEmail: process.env.SENDER_EMAIL || 'email@email.com',
  senderEmailPassword: process.env.SENDER_EMAIL_PASSWORD || 'emailPassword',
}));
