import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from './menu.service';
import { Menu } from '../../../../libs/database/entities/menu.entity';
import { User } from '../../../../libs/database/entities/user.entity';
import { Dish } from '../../../../libs/database/entities/dish.entity';
import { MenuDish } from '../../../../libs/database/entities/menu_dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, User, Dish, MenuDish])],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
