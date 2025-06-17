import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Menu } from './menu.entity';
import { Dish } from './dish.entity';

@Entity({ name: 'Menu_Dish' })
export class MenuDish {
  @PrimaryColumn()
  menuId: number;

  @PrimaryColumn()
  dishesId: number;

  @ManyToOne(() => Menu, menu => menu.menuDishes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menuId' })
  menu: Menu;

  @ManyToOne(() => Dish, dish => dish.menuDishes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dishesId' })
  dish: Dish;

  @Column({ type: 'float', nullable: true })
  differCost: number;
}
