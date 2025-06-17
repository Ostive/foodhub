import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Promo } from './promo.entity';

@Entity({ name: 'promo_available_users' })
export class PromoAvailableUser {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    promoId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Promo, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'promoId' })
    promo: Promo;
}