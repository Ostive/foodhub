import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Topping } from './topping.entity';
import { Allergen } from './allergen.entity';

@Entity({ name: 'Toping_Allergens' })
export class ToppingAllergen {
  @PrimaryColumn()
  topingId: number;

  @PrimaryColumn()
  allergensId: number;

  @ManyToOne(() => Topping, topping => topping.toppingAllergens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topingId' })
  topping: Topping;

  @ManyToOne(() => Allergen, allergen => allergen.toppingAllergens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'allergensId' })
  allergen: Allergen;
}
