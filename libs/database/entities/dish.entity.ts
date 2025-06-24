import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { OneToMany } from "typeorm";
import { DishesTopping } from './dish_topping.entity';
import { DishAllergen } from './dish_allergen.entity';
import { MenuDish } from './menu_dish.entity';
import { Comment } from './comment.entity';
import { OrderDish } from './order_dish.entity';
import { PersonalizationOption } from './personalization-option.entity';

@Entity({ name: 'dishes' })
export class Dish {
  @PrimaryGeneratedColumn()
  dishId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.creditCards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'boolean'})
  isSoldAlone: boolean;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @Column({ type: 'boolean'})
  isVegetarian: boolean;

  @Column({ type: 'int', nullable: true })
  spicyLevel: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'float'})
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
  
  @OneToMany(() => PersonalizationOption, po => po.dish, { cascade: true })
  personalizationOptions: PersonalizationOption[];

  @OneToMany(() => Comment, comment => comment.dish)
  comments: Comment[];

  @OneToMany(() => OrderDish, od => od.dish)
  orderDishes: OrderDish[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
