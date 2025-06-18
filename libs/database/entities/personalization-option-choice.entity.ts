import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'personalization_option_choices' })
export class PersonalizationOptionChoice {
  @PrimaryGeneratedColumn()
  choiceId: number;

  @Column()
  optionId: number;

  @ManyToOne('PersonalizationOption', 'choices', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'optionId' })
  option: any;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'float', default: 0 })
  additionalPrice: number;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;
}
