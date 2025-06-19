import { Controller, Get } from '@nestjs/common';
import { PerformanceServiceService, PerformanceMetric } from './performance-service.service';

@Controller('performance')
export class PerformanceServiceController {
  constructor(private readonly performanceServiceService: PerformanceServiceService) {}

  @Get()
  async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    try {
      return await this.performanceServiceService.getPerformanceMetrics();
    } catch (error) {
      console.error('Error in PerformanceServiceController:', error);
      throw error;
    }
  }
}
