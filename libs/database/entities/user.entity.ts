import * as bcrypt from 'bcrypt';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { OneToMany } from 'typeorm';
import { CreditCard } from './credit_card.entity';
import { Topping } from './topping.entity';
import { Dish } from './dish.entity';
import { Menu } from './menu.entity';


@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ type: 'varchar', length: 500, nullable: true })
    profilePicture: string;

    @Column({ type: 'varchar', length: 50 })
    firstName: string;

    @Column({ type: 'varchar', length: 50 })
    lastName: string;

    @Column({ type: 'date', nullable: true })
    birthDate: Date;

    @Column({type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: true /* AUTO_RANDOM n'existe pas sur typeorm, générer côté code */ })
    referralCode: number;

    @Column({ type: 'varchar', length: 255 })
    role: 'customer' | 'delivery' | 'restaurateur' | 'developer' | 'manager' | 'admin' = 'customer';

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    homeLocalisation: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    transport: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    tags: string;

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }

    @OneToMany(() => CreditCard, creditCard => creditCard.user)
    creditCards: CreditCard[];

    @OneToMany(() => Topping, topping => topping.user)
    toppings: Topping[];


    //Restaurateur
    @OneToMany(() => Dish, dish => dish.user)
    dishes: Dish[];

    @OneToMany(() => Menu, menu => menu.user)
    menus: Menu[];
}