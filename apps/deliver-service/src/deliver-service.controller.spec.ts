import { Test, TestingModule } from '@nestjs/testing';
import { DeliverServiceController } from './deliver-service.controller';
import { DeliverServiceService } from './deliver-service.service';

describe('DeliverServiceController', () => {
  let deliverServiceController: DeliverServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DeliverServiceController],
      providers: [DeliverServiceService],
    }).compile();

    deliverServiceController = app.get<DeliverServiceController>(DeliverServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(deliverServiceController.getHello()).toBe('Hello World!');
    });
  });
});
