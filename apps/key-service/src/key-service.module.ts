import { Module } from '@nestjs/common';
import { KeyServiceController } from './key-service.controller';
import { KeyServiceService } from './key-service.service';

@Module({
  controllers: [KeyServiceController],
  providers: [KeyServiceService],
})
export class KeyServiceModule {}
