import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { OneToMany } from "typeorm";
import { DishesTopping } from './dish_topping.entity';
import { DishAllergen } from './dish_allergen.entity';
import { MenuDish } from './menu_dish.entity';
import { Comment } from './comment.entity';
import { OrderDish } from './order_dish.entity';

@Entity({ name: 'dishes' })
export class Dish {
  @PrimaryGeneratedColumn()
  dishId: number;

  @ManyToOne(() => User, user => user.dishes)
  user: User;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'boolean', nullable: true })
  isSoldAlone: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tags: string;

  @Column({ type: 'boolean', nullable: true })
  isVegetarian: boolean;

  @Column({ type: 'int', nullable: true })
  spicyLevel: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category: string;

  @Column({ type: 'float', nullable: true })
  cost: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  additionalAllergens: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  picture: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  promo: string;

  @OneToMany(() => DishesTopping, dt => dt.dish)
  dishesToppings: DishesTopping[];

  @OneToMany(() => DishAllergen, da => da.dish)
  dishAllergens: DishAllergen[];

  @OneToMany(() => MenuDish, md => md.menu)
  menuDishes: MenuDish[];

  @OneToMany(() => Comment, comment => comment.dish)
  comments: Comment[];

  @OneToMany(() => OrderDish, od => od.dish)
  orderDishes: OrderDish[];


}
