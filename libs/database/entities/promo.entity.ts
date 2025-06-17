import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'promos'})
export class Promo {
    @PrimaryGeneratedColumn()
    promoId: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 500 })
    description: string;

    @OneToMany(() => Order, order => order.promo)
    order: Order[];
}
