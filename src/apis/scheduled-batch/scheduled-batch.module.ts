import { Module } from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from '../user/user.module';
import { ScheduledBatchService } from './scheduled-batch.service';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule],
  providers: [ScheduledBatchService],
})
export class ScheduledBatchModule {}
