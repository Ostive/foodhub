import { NestFactory } from '@nestjs/core';
import { DeliverServiceModule } from './deliver-service.module';

async function bootstrap() {
  const app = await NestFactory.create(DeliverServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
