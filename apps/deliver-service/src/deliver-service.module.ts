import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverServiceController } from './deliver-service.controller';
import { DeliverServiceService } from './deliver-service.service';
import { DatabaseModule } from '../../../libs/database/database.module';
import { User } from '../../../libs/database/entities/user.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [DeliverServiceController],
  providers: [DeliverServiceService],
  exports: [DeliverServiceService]
})
export class DeliverServiceModule {}
