
import * as bcrypt from 'bcrypt';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
@Entity()   
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    password: string;

    
    @Column()
    email: string;
    @Column({ default: 'customer' })
    role: 'customer' | 'admin'; // 'customer' or 'admin'

    @BeforeInsert()
    async setPassword(password: string) {
        const salt = await bcrypt.genSalt()
        this.password = await bcrypt.hash(password || this.password, salt)
    }

}
