import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Promo } from './promo.entity';
import { OrderDish } from './order_dish.entity';
import { OrderMenu } from './order_menu.entity';
import { OrderStatus } from './order_status.enum';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @Column()
  customerId: number;

  @Column()
  restaurantId: number;

  @Column({ nullable: true })
  deliveryId: number;

  @Column({ nullable: true })
  promoId: number;

  @Column({ type: 'varchar', length: 255 })
  deliveryLocalisation: string;

  @Column({ type: 'timestamp' })
  time: Date;

  @Column({ type: 'float' })
  cost: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  deliveryFee: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;

  @Column({ type: 'varchar', length: 6, nullable: true })
  verificationCode: string;

  // Relations utilisateurs, tous pointant vers User (mais différenciés par leur rôle l’app)
  @ManyToOne(() => User, user => user.customerOrders, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @ManyToOne(() => User, user => user.restaurantOrders, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: User;

  @ManyToOne(() => User, user => user.deliveryOrders, { onDelete: 'SET NULL'})
  @JoinColumn({ name: 'deliveryId' })
  delivery: User;

  @ManyToOne(() => Promo, promo => promo.orders, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'promoId' })
  promo: Promo;

  @OneToMany(() => OrderDish, od => od.order)
  orderDishes: OrderDish[];

  @OneToMany(() => OrderMenu, om => om.order)
  orderMenus: OrderMenu[];


}
