import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity({ name: 'Dishes' })
export class Dish {
  @PrimaryGeneratedColumn()
  dishId: number;

  @ManyToOne(() => Restaurant, restaurant => restaurant.dishes)
  restaurant: Restaurant;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'boolean', nullable: true })
  isSoldAlone: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  food: string;

  @Column({ type: 'boolean', nullable: true })
  isVegetarian: boolean;

  @Column({ type: 'int', nullable: true })
  isSpicy: number;

  @Column({ type: 'varchar', length: 50 })
  dishName: string;

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
}
