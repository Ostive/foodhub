import * as bcrypt from 'bcrypt';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { OneToMany } from 'typeorm';
import { OneToOne } from 'typeorm';
import { CreditCard } from './credit_card.entity';
import { Topping } from './topping.entity';
import { Dish } from './dish.entity';
import { Menu } from './menu.entity';
import { Planning } from './planning.entity';
import { Order } from './order.entity';
import { Comment } from './comment.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ type: 'varchar', length: 50 })
    firstName: string;

    @Column({ type: 'varchar', length: 50, nullable: true  })
    lastName: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    phone: string;

    @Column({ type: 'date', nullable: true })
    birthDate: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string;

    @Column({type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: true /* AUTO_RANDOM n'existe pas sur typeorm, générer côté code */ })
    referralCode: string;

    @Column({ type: 'varchar', length: 255 })
    role: 'customer' | 'delivery_person' | 'restaurant' | 'developer' | 'manager' | 'admin' = 'customer';

    @Column({ type: 'varchar', length: 500, nullable: true })
    profilePicture: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    transport: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    website: string;   

    @Column({ type: 'varchar', length: 50, nullable: true })
    rib: string;
    
    @Column('text', { array: true, nullable: true })
    tags: string[];

    @Column({ type: 'float' , nullable: true })
    minimumPurchase: number;   

    @Column({ type: 'float' , nullable: true })
    deliveryRadius: number;   

    @Column({ type: 'varchar', length: 20, nullable: true })
    averagePreparationTime: string;

    @OneToMany(() => CreditCard, creditCard => creditCard.user)
    creditCards: CreditCard[];

    @OneToMany(() => Topping, topping => topping.user)
    toppings: Topping[];

    @OneToMany(() => Dish, dish => dish.user)
    dishes: Dish[];

    @OneToMany(() => Menu, menu => menu.user)
    menus: Menu[];

    @OneToOne(() => Planning, planning => planning.user)
    planning: Planning;

    @OneToMany(() => Order, order => order.customer)
    customerOrders: Order[];

    @OneToMany(() => Order, order => order.restaurant)
    restaurantOrders: Order[];

    @OneToMany(() => Order, order => order.delivery)
    deliveryOrders: Order[];

    @OneToMany(() => Comment, comment => comment.customer)
    customerComments: Comment[];

    @OneToMany(() => Comment, comment => comment.restaurant)
    restaurantComments: Comment[];
}