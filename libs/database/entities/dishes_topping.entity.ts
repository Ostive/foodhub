import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Dish } from './dishes.entity';
import { Topping } from './topping.entity';

@Entity({ name: 'Dishes_Topping' })
export class DishesTopping {
  @PrimaryColumn()
  topingId: number;

  @PrimaryColumn()
  dishesId: number;

  @ManyToOne(() => Topping, topping => topping.dishesToppings, { onDelete: 'CASCADE' })
  @JoinColumn()
  topping: Topping;

  @ManyToOne(() => Dish, dish => dish.dishesToppings, { onDelete: 'CASCADE' })
  @JoinColumn()
  dish: Dish;

  @Column({ type: 'float', nullable: true })
  differCost: number;
}
