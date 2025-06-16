import * as bcrypt from 'bcrypt';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    profilePicture: string;

    @Column({ type: 'varchar', length: 50 })
    firstName: string;

    @Column({ type: 'varchar', length: 50 })
    lastName: string;

    @Column({ type: 'date', nullable: true })
    birthDate: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    homeLocalisation: string;

    @Column({type: 'varchar', length: 255 })
    passwordHash: string;

    @Column({ type: 'varchar', nullable: true /* AUTO_RANDOM n'existe pas sur typeorm, générer côté code */ })
    referralCode: number;

    @Column({ type: 'varchar', length: 255 })
    role: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    transport: string;

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt();
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }
}