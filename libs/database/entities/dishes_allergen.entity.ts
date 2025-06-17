import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Dish } from './dishes.entity';
import { Allergen } from './allergen.entity';

@Entity({ name: 'Dishes_Allergens' })
export class DishAllergen {
  @PrimaryColumn()
  dishId: number;

  @PrimaryColumn()
  allergenId: number;

  @ManyToOne(() => Dish, dish => dish.dishAllergens, { onDelete: 'CASCADE' })
  @JoinColumn()
  dish: Dish;

  @ManyToOne(() => Allergen, allergen => allergen.dishAllergens, { onDelete: 'CASCADE' })
  @JoinColumn()
  allergen: Allergen;
}