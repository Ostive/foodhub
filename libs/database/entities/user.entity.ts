import * as bcrypt from 'bcrypt';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, CreateDateColumn } from 'typeorm';
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

    @Column({ type: 'varchar', length: 500, nullable: true })
    profilePicture: string;

    // For all users
    @Column({ type: 'varchar', length: 50 })
    firstName: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    lastName: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string;

    // Role and referral
    @Column({ type: 'varchar', length: 255 })
    role: 'customer' | 'delivery_person' | 'restaurant' | 'developer' | 'manager' | 'admin' = 'customer';

    @Column({ type: 'varchar', length: 255, nullable: true })
    referralCode: string;

    // Customer specific
    @Column({ type: 'date', nullable: true })
    birthDate: Date;

    // Delivery specific
    @Column({ type: 'varchar', length: 50, nullable: true })
    transport: string;

    // Restaurant specific
    @Column({ type: 'varchar', length: 50, nullable: true })
    website: string;

    @Column({ type: 'int', nullable: true })
    minimumPurchase: number;

    @Column({ type: 'float', nullable: true })
    deliveryRadius: number;

    @Column({ type: 'int', nullable: true })
    averagePreparationTime: number;

    @CreateDateColumn()
    createdAt: Date;

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }

    @OneToMany(() => CreditCard, creditCard => creditCard.user)
    creditCards: CreditCard[];

    

    //Restaurateur
    @OneToMany(() => Dish, dish => dish.user)
    dishes: Dish[];

    @OneToMany(() => Menu, menu => menu.user)
    menus: Menu[];

    @OneToMany(() => Topping, topping => topping.user)
    toppings: Topping[];

    @OneToOne(() => Planning, planning => planning.user)
    planning: Planning;

    

    @OneToMany(() => Order, order => order.restaurant)
    restaurantOrders: Order[];

    @OneToMany(() => Order, order => order.customer)
    customerOrders: Order[];

    @OneToMany(() => Comment, comment => comment.restaurant)
    restaurantComments: Comment[];

    @OneToMany(() => Comment, comment => comment.customer)
    customerComments: Comment[];

    
    @OneToMany(() => Order, order => order.delevery)
    deleveryOrders: Order[];

   

    
}