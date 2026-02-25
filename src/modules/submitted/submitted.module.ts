import { Module } from '@nestjs/common';
import { SubmittedController } from './controller/submitted.controller';
import { SubmittedService } from './service/submitted.service';
import { NotificationModule } from '../notification/notification.module';
import { ChartMainService } from '../chart/service/chart.main.service';

@Module({
   imports: [NotificationModule], 
  controllers: [SubmittedController],
  providers: [SubmittedService,  ChartMainService ],
  exports: [SubmittedService],
})
export class SubmittedModule {}
