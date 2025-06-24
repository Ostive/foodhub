import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OneToMany } from "typeorm";
import { User } from './user.entity';
import { MenuDish } from './menu_dish.entity';
import { Comment } from './comment.entity';
import { OrderDish } from './order_dish.entity';
import { OrderMenu } from './order_menu.entity';
import { MenuTopping } from './menu_topping.entity';


@Entity({ name: 'menus' })
export class Menu {
  @PrimaryGeneratedColumn()
  menuId: number;

  @ManyToOne(() => User, user => user.menus)
  user: User;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @Column({ type: 'boolean', nullable: true })
  isVegetarian: boolean;

  @Column({ type: 'int', nullable: true })
  spicyLevel: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  comment: string;

  @Column({ type: 'float', nullable: true })
  cost: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  additionalAllergens: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  picture: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  promo: string;

  @OneToMany(() => MenuDish, md => md.menu)
  menuDishes: MenuDish[];

  @OneToMany(() => Comment, comment => comment.menu)
  comments: Comment[];

  @OneToMany(() => OrderMenu, om => om.menu)
  orderMenus: OrderMenu[];

  @OneToMany(() => MenuTopping, mt => mt.menu)
  menuToppings: MenuTopping[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
