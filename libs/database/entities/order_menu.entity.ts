import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Menu } from './menu.entity';

@Entity({ name: 'Order_Menu' })
export class OrderMenu {
  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  menuId: number;

  @ManyToOne(() => Order, order => order.orderMenus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Menu, menu => menu.orderMenus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menuId' })
  menu: Menu;
}