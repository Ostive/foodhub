import { Controller, Get } from '@nestjs/common';
import { PerformanceServiceService, PerformanceMetric } from './performance-service.service';

@Controller('performance')
export class PerformanceServiceController {
  constructor(private readonly performanceServiceService: PerformanceServiceService) {}

  @Get()
  async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    return await this.performanceServiceService.getPerformanceMetrics();
  }
}
