import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Promo {
    @PrimaryGeneratedColumn()
    promoId: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 500 })
    description: string;
}
