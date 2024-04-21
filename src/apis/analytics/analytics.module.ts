import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { VideoModule } from '../video/video.module';
import { AnalyticsService } from './analytics.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [ScheduleModule.forRoot(), VideoModule, MailModule],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
