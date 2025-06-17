import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Menu } from './menu.entity';
import { Dish } from './dish.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  customerId: number;

  @Column({ nullable: true })
  restaurantId: number;

  @Column({ nullable: true })
  menuId: number;

  @Column({ nullable: true })
  dishesId: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comment: string;

  @Column({ type: 'float'})
  grade: number;

  // Relations
  @ManyToOne(() => User, user => user.customerComments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @ManyToOne(() => User, user => user.restaurantComments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: User;

  @ManyToOne(() => Menu, menu => menu.comments, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'menuId' })
  menu: Menu;

  @ManyToOne(() => Dish, dish => dish.comments, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'dishesId' })
  dish: Dish;
}
