import { Test, TestingModule } from '@nestjs/testing';
import { KeyServiceController } from './key-service.controller';
import { KeyServiceService } from './key-service.service';

describe('KeyServiceController', () => {
  let keyServiceController: KeyServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [KeyServiceController],
      providers: [KeyServiceService],
    }).compile();

    keyServiceController = app.get<KeyServiceController>(KeyServiceController);
  });

  
});
