import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Dish } from './dish.entity';

@Entity({ name: 'Order_Dish' })
export class OrderDish {
  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  dishId: number;

  @ManyToOne(() => Order, order => order.orderDish, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Dish, dish => dish.orderDish, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dishId' })
  dish: Dish;
}
