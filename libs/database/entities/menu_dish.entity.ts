import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Menu } from './menu.entity';
import { Dish } from './dish.entity';

@Entity({ name: 'menu_dishes' })
export class MenuDish {
  @PrimaryColumn()
  menuId: number;

  @PrimaryColumn()
  dishId: number;

  @ManyToOne(() => Menu, menu => menu.menuDishes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menuId' })
  menu: Menu;

  @ManyToOne(() => Dish, dish => dish.menuDishes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dishId' })
  dish: Dish;

  @Column({ type: 'float', nullable: true })
  differCost: number | null;
}
