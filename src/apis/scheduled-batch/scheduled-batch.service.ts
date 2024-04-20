import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../user/user.service';

@Injectable()
export class ScheduledBatchService {
  constructor(private readonly userService: UserService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async unVerifiedUserOver30DaysCleanUp() {
    Logger.log('unVerifiedUserOver30DaysCleanUp called');
    await this.userService.removeUnVerifiedUserOver30Days();
  }
}
