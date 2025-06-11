import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { OrderServiceController } from './order-service.controller';
import { OrderServiceService } from './order-service.service';

@Module({
  imports: [],
  controllers: [OrderServiceController],
  providers: [
    OrderServiceService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
      useFactory: () => new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class OrderServiceModule {}
