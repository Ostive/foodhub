import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Allergen' })
export class Allergen {
  @PrimaryGeneratedColumn()
  allergensId: number;

  @Column({ type: 'varchar', length: 100 })
  allergenName: string;

}