import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IMailServiceSendUserServiceAuthCode } from './interface/mail-service.interface';

import { ConfigService } from '@nestjs/config';
import { Video } from '../video/entity/video.entity';
import { sendUserServiceAuthCodeTemplate } from './mail-template/send-user-authcode-template';
import { sendAnalyticsServiceFindTop5downloadVideosTemplate } from './mail-template/find-top5-download-videos-template';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserServiceAuthCode({
    authCode,
    email,
  }: IMailServiceSendUserServiceAuthCode): Promise<void> {
    const username = email.split('@')[0];
    const mailHtmlData = sendUserServiceAuthCodeTemplate({
      username,
      authCode,
    });

    await this.mailerService
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

  async sendAnalyticsServiceFindTop5downloadVideos(videos: Video[]) {
    const data = videos.map(
      ({ id, title, download_cnt }) =>
        `<tr><td>${id}</td><td>${title}</td><td>${download_cnt}</td></tr>`,
    );
    const mailHtmlData = sendAnalyticsServiceFindTop5downloadVideosTemplate({
      data,
    });

    await this.mailerService
      .sendMail({
        to: this.configService.get('mail.senderEmail'),
        from: 'nesttube@nesttube.com',
        subject: 'Top 5 Downloaded Videos by Nest Tube',
        html: mailHtmlData,
      })
      .then(() => {})
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
  }
}
