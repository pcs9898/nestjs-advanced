import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  IMailServiceGetEmailData,
  IMailServiceSend,
} from './interface/mail-service.interface';
import { welcome_send_mail_template } from './mail-template/welcome_template';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async send({ authCode, email }: IMailServiceSend): Promise<void> {
    const username = email.split('@')[0];
    const mailHtmlData = this.getEmailData({ authCode, username });

    this.mailerService
      .sendMail({
        to: email,
        from: this.configService.get('mail.senderEmail'),
        subject: `Hello ${username}`,
        html: mailHtmlData,
      })
      .then(() => {})
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
  }

  private getEmailData = ({ authCode, username }: IMailServiceGetEmailData) => {
    return welcome_send_mail_template({ username, authCode });
  };
}
