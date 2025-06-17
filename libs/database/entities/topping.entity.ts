import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { ToppingAllergen } from './topping_allergen.entity';
import { OneToMany } from "typeorm";
import { DishesTopping } from './dish_topping.entity';
import { MenuTopping } from './menu_topping.entity';

@Entity({ name: 'toppings' })
export class Topping {
  @PrimaryGeneratedColumn()
  toppingId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  comment: string;

  @Column({ type: 'float', nullable: true })
  cost: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  picture: string;

  @Column({ type: 'varchar', length: 500, default: false })
  promo: boolean;

  @ManyToOne(() => User, user => user.toppings)
  user: User;

  @OneToMany(() => ToppingAllergen, ta => ta.topping)
  toppingAllergens: ToppingAllergen[];

  @OneToMany(() => DishesTopping, dt => dt.topping)
  dishesToppings: DishesTopping[];

  @OneToMany(() => MenuTopping, mt => mt.topping)
  menuToppings: MenuTopping[];
}
