import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { OneToMany } from "typeorm";
import { DishesTopping } from './dish_topping.entity';
import { DishAllergen } from './dish_allergen.entity';


@Entity({ name: 'Dishes' })
export class Dish {
  @PrimaryGeneratedColumn()
  dishId: number;

  @ManyToOne(() => User, user => user.dish)
  user: User;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'boolean', nullable: true })
  isSoldAlone: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  food: string;

  @Column({ type: 'boolean', nullable: true })
  isVegetarian: boolean;

  @Column({ type: 'int', nullable: true })
  Spicy: number;

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
}
