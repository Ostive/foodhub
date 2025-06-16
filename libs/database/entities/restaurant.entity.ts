import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Topping } from './topping.entity';
import { OneToMany } from "typeorm";
import { Dish } from './dishes.entity';
import { Menu } from './menu.entity';

@Entity()
export class Restaurant {
    @PrimaryGeneratedColumn()
    restaurantId: number;

    @Column({ type: 'varchar', length: 500, nullable: true })
    profilePicture: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    localisation: string;

    @Column({ type: 'varchar', length: 50 })
    rib: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    tags: string;

    @Column({ type: 'varchar', length: 50 })
    login: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @OneToMany(() => Topping, topping => topping.restaurant)
    toppings: Topping[];

    @OneToMany(() => Dish, dish => dish.restaurant)
    dishes: Dish[];

    @OneToMany(() => Menu, menu => menu.restaurant)
    menus: Menu[];
}
