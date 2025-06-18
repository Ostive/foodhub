import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from './menu.service';
import { Menu } from '../../../../libs/database/entities/menu.entity';
import { User } from '../../../../libs/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, User])],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
