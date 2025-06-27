import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Dish } from './dish.entity';

type PersonalizationChoice = {
  optionId: number;
  choiceIds: number[];
};

@Entity({ name: 'order_dishes' })
export class OrderDish {
  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  dishId: number;
  
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'float', nullable: true })
  price: number;

  @Column({ type: 'jsonb', nullable: true })
  personalizationChoices: PersonalizationChoice[];

  @ManyToOne(() => Order, order => order.orderDishes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Dish, dish => dish.orderDishes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dishId' })
  dish: Dish;
}
