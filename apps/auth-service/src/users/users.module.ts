import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersHttpService } from './users-http.service';

@Module({
  imports: [HttpModule],
  providers: [UsersHttpService],
  exports: [UsersHttpService],
})
export class UsersModule {}
