import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Menu } from './menu.entity';
import { Topping } from './topping.entity';

@Entity({ name: 'Menu_Topping' })
export class MenuTopping {
  @PrimaryColumn()
  toppingId: number;

  @PrimaryColumn()
  menuId: number;

  @Column({ type: 'float', nullable: true })
  differCost: number;

  @ManyToOne(() => Menu, menu => menu.menuToppings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menuId' })
  menu: Menu;

  @ManyToOne(() => Topping, topping => topping.menuToppings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'toppingId' })
  topping: Topping;
}