import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class CreditCard {
    @PrimaryGeneratedColumn()
    creditCardId: number;

    @Column()
    userId: number;

    @Column({ type: 'varchar', length: 16 })
    creditCardNumber: string;

    @Column({ type: 'varchar', length: 5 })
    expiryDate: string;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @ManyToOne(() => User, user => user.creditCards, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}