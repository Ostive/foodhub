import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'planning' })
export class Planning {
  @PrimaryGeneratedColumn()
  planningId: number;

  @Column()
  userId: number;

  @OneToOne(() => User, user => user.planning, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ type: 'varchar', length: 20 })
  monday: string;
  @Column({ type: 'varchar', length: 20 })
  tuesday: string;
  @Column({ type: 'varchar', length: 20 })
  wednesday: string;
  @Column({ type: 'varchar', length: 20 })
  thursday: string;
  @Column({ type: 'varchar', length: 20 })
  friday: string;
  @Column({ type: 'varchar', length: 20 })
  saturday: string;
  @Column({ type: 'varchar', length: 20 })
  sunday: string;
}
