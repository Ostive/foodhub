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

  @Column({ type: 'time' }) mondayOpen: string;
  @Column({ type: 'time' }) mondayClose: string;
  @Column({ type: 'time' }) tuesdayOpen: string;
  @Column({ type: 'time' }) tuesdayClose: string;
  @Column({ type: 'time' }) wednesdayOpen: string;
  @Column({ type: 'time' }) wednesdayClose: string;
  @Column({ type: 'time' }) thursdayOpen: string;
  @Column({ type: 'time' }) thursdayClose: string;
  @Column({ type: 'time' }) fridayOpen: string;
  @Column({ type: 'time' }) fridayClose: string;
  @Column({ type: 'time' }) saturdayOpen: string;
  @Column({ type: 'time' }) saturdayClose: string;
  @Column({ type: 'time' }) sundayOpen: string;
  @Column({ type: 'time' }) sundayClose: string;
}
