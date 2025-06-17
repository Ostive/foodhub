import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ToppingAllergen } from './topping_allergen.entity';
import { OneToMany } from "typeorm";
import { DishAllergen } from './dish_allergen.entity';

@Entity({ name: 'allergens' })
export class Allergen {
  @PrimaryGeneratedColumn()
  allergenId: number;

  @Column({ type: 'varchar', length: 100 })
  allergenName: string;

  @OneToMany(() => ToppingAllergen, ta => ta.allergen)
  toppingAllergens: ToppingAllergen[];

  @OneToMany(() => DishAllergen, da => da.dish)
  dishAllergens: DishAllergen[];
}