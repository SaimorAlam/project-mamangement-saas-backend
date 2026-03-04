import { Module } from '@nestjs/common';
import { SubmittedController } from './controller/submitted.controller';
import { SubmittedService } from './service/submitted.service';
import { NotificationModule } from '../notification/notification.module';
import { ChartMainService } from '../chart/service/chart.main.service';
import { ActivityService } from '../activity/service/activity.service';

@Module({
  imports: [NotificationModule],
  controllers: [SubmittedController],
  providers: [SubmittedService, ChartMainService, ActivityService],
  exports: [SubmittedService],
})
export class SubmittedModule { }
