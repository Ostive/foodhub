import { Module } from '@nestjs/common';
import { PerformanceServiceService } from './performance-service.service';
import { PerformanceServiceController } from './performance-service.controller';

@Module({
  controllers: [PerformanceServiceController],
  providers: [PerformanceServiceService],
})
export class PerformanceServiceModule {}
