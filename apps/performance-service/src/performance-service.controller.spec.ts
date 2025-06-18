import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceServiceController } from './performance-service.controller';
import { PerformanceServiceService } from './performance-service.service';

describe('PerformanceServiceController', () => {
  let performanceServiceController: PerformanceServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PerformanceServiceController],
      providers: [PerformanceServiceService],
    }).compile();

    performanceServiceController = app.get<PerformanceServiceController>(PerformanceServiceController);
  });

  // Tests à ajouter ici plus tard si nécessaire
});
