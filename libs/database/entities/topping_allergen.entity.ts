import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Topping } from './topping.entity';
import { Allergen } from './allergen.entity';

@Entity({ name: 'topping_allergens' })
export class ToppingAllergen {
  @PrimaryColumn()
  toppingId: number;

  @PrimaryColumn()
  allergenId: number;

  @ManyToOne(() => Topping, topping => topping.toppingAllergens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'toppingId' })
  topping: Topping;

  @ManyToOne(() => Allergen, allergen => allergen.toppingAllergens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'allergenId' })
  allergen: Allergen;
}
