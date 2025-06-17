import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'menus' })
export class Menu {
  @PrimaryGeneratedColumn()
  menuId: number;

  @ManyToOne(() => User, user => user.menus)
  user: User;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tags: string;

  @Column({ type: 'boolean', nullable: true })
  isVegetarian: boolean;

  @Column({ type: 'int', nullable: true })
  spicyLevel: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  comment: string;

  @Column({ type: 'float', nullable: true })
  cost: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  additionalAllergens: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  picture: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  promo: string;
}
