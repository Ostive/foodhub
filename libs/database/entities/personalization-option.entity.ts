import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Dish } from './dish.entity';

@Entity({ name: 'personalization_options' })
export class PersonalizationOption {
  @PrimaryGeneratedColumn()
  optionId: number;

  @Column()
  dishId: number;

  @ManyToOne(() => Dish, dish => dish.personalizationOptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dishId' })
  dish: Dish;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 10 })
  type: 'single' | 'multiple';

  @Column({ type: 'boolean', default: false })
  required: boolean;

  @OneToMany('PersonalizationOptionChoice', 'option', { cascade: true })
  choices: any[];
}
