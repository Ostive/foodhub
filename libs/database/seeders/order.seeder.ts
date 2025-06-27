import { DataSource, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderDish } from '../entities/order_dish.entity';
import { OrderMenu } from '../entities/order_menu.entity';
import { OrderStatus } from '../entities/order_status.enum';
import { User } from '../entities/user.entity';
import { Dish } from '../entities/dish.entity';
import { Menu } from '../entities/menu.entity';
import { faker } from '@faker-js/faker';

type OrderDishChoice = {
  optionId: number;
  choiceIds: number[];
};

type OrderDishData = {
  dishId: number;
  quantity: number;
  price?: number;
  specialInstructions?: string;
  personalizationChoices?: OrderDishChoice[];
};

type OrderMenuData = {
  menuId: number;
  quantity: number;
  price?: number;
  specialInstructions?: string;
};

type OrderData = {
  customerId: number;
  restaurantId: number;
  deliveryLocalisation: string;
  time: Date;
  cost: number;
  deliveryFee: number;
  status: OrderStatus;
  verificationCode: string;
  dishes: OrderDishData[];
  menus: OrderMenuData[];
};

export class OrderSeeder {
  private orderRepository: Repository<Order>;
  private orderDishRepository: Repository<OrderDish>;
  private orderMenuRepository: Repository<OrderMenu>;
  private userRepository: Repository<User>;
  private dishRepository: Repository<Dish>;
  private menuRepository: Repository<Menu>;

  constructor(private dataSource: DataSource) {
    this.orderRepository = this.dataSource.getRepository(Order);
    this.orderDishRepository = this.dataSource.getRepository(OrderDish);
    this.orderMenuRepository = this.dataSource.getRepository(OrderMenu);
    this.userRepository = this.dataSource.getRepository(User);
    this.dishRepository = this.dataSource.getRepository(Dish);
    this.menuRepository = this.dataSource.getRepository(Menu);
  }

  private async generateSampleOrders(customers: User[], restaurants: User[]): Promise<OrderData[]> {
    const orders: OrderData[] = [];
    const statuses: OrderStatus[] = [
      OrderStatus.CREATED,
      OrderStatus.ACCEPTED_RESTAURANT,
      OrderStatus.PREPARING,
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERED,
    ];

    // We'll fetch dishes and menus per restaurant as we create orders
    if (restaurants.length === 0) {
      console.warn('⚠️  No restaurants found. Please seed restaurants first.');
      return [];
    }

    // Generate 5-10 sample orders (fewer to ensure we have enough dishes/menus)
    const orderCount = faker.number.int({ min: 5, max: 10 });

    for (let i = 0; i < orderCount; i++) {
      const customer = faker.helpers.arrayElement(customers);
      const restaurant = faker.helpers.arrayElement(restaurants);
      const status = faker.helpers.arrayElement(statuses);
      const orderTime = faker.date.recent({ days: 30 });
      
      // Get dishes that belong to this restaurant and can be sold alone
      const restaurantDishes = await this.dishRepository.find({
        where: { 
          userId: restaurant.userId,
          isSoldAlone: true 
        },
        select: ['dishId', 'cost']
      });
      
      // Get menus that belong to this restaurant
      const restaurantMenus = await this.menuRepository.createQueryBuilder('menu')
        .innerJoin('menu.user', 'user')
        .where('user.userId = :userId', { userId: restaurant.userId })
        .select(['menu.menuId', 'menu.cost'])
        .getMany();
      
      // Log restaurant dishes and menus for debugging
      console.log(`Restaurant ${restaurant.userId} (${restaurant.firstName}) has ${restaurantDishes.length} dishes and ${restaurantMenus.length} menus`);
      
      // Skip if restaurant has no dishes
      if (restaurantDishes.length === 0) {
        console.log(`Skipping order for restaurant ${restaurant.userId} (${restaurant.firstName}) - no dishes available`);
        continue;
      }
      
      // Generate 1-2 dishes and 0-1 menus per order
      const dishCount = Math.min(faker.number.int({ min: 1, max: 2 }), restaurantDishes.length);
      const menuCount = restaurantMenus.length > 0 ? faker.number.int({ min: 0, max: 1 }) : 0;
      
      // Shuffle and take unique dish IDs from this restaurant
      const restaurantDishIds = restaurantDishes.map(dish => dish.dishId);
      const selectedDishIds = faker.helpers.shuffle([...restaurantDishIds]).slice(0, dishCount);
      const dishes: OrderDishData[] = selectedDishIds.map(dishId => ({
        dishId,
        quantity: faker.number.int({ min: 1, max: 3 })
      }));
      
      // Shuffle and take unique menu IDs from this restaurant
      const restaurantMenuIds = restaurantMenus.map(menu => menu.menuId);
      const selectedMenuIds = menuCount > 0 
        ? faker.helpers.shuffle([...restaurantMenuIds]).slice(0, menuCount)
        : [];
      const menus: OrderMenuData[] = selectedMenuIds.map(menuId => ({
        menuId,
        quantity: faker.number.int({ min: 1, max: 2 })
      }));
      
      // Get dish details with personalization options
      const dishDetails = await Promise.all(selectedDishIds.map(id => 
        this.dishRepository.findOne({ 
          where: { dishId: id },
          relations: ['personalizationOptions', 'personalizationOptions.choices']
        })
      ));
      
      // Get menu prices (already have costs from initial query, but keeping this for consistency)
      const menuPrices = await Promise.all(selectedMenuIds.map(id =>
        this.menuRepository.findOne({ where: { menuId: id }, select: ['cost'] })
      ));

      // Calculate dish costs with personalization choices
      let dishCost = 0;
      const updatedDishes: OrderDishData[] = [];
      
      for (let i = 0; i < dishes.length; i++) {
        const dish = dishDetails[i];
        const item = dishes[i];
        if (!dish) continue;
        
        let itemCost = dish.cost || 0;
        const personalizationChoices: Array<{optionId: number, choiceIds: number[]}> = [];
        
        // Add personalization choices if the dish has options
        if (dish.personalizationOptions?.length > 0) {
          for (const option of dish.personalizationOptions) {
            if (option.required || faker.datatype.boolean(0.7)) { // 70% chance to include optional choices
              const choices = option.choices || [];
              if (choices.length > 0) {
                const selectedChoices = option.type === 'single'
                  ? [faker.helpers.arrayElement(choices)] // Single choice
                  : faker.helpers.arrayElements(choices, { 
                      min: 1, 
                      max: Math.min(3, choices.length) 
                    });
                
                // Add additional costs from selected choices
                selectedChoices.forEach(choice => {
                  itemCost += choice.additionalPrice || 0;
                });
                
                personalizationChoices.push({
                  optionId: option.optionId,
                  choiceIds: selectedChoices.map((c: { choiceId: number }) => c.choiceId)
                });
              }
            }
          }
        }
        
        // Update the dish with personalization choices and price
        updatedDishes.push({
          ...item,
          price: itemCost, // Store the calculated price including personalization
          personalizationChoices: personalizationChoices.length > 0 ? personalizationChoices : undefined
        });
        
        dishCost += item.quantity * itemCost;
      }
      
      // Update menus with prices and calculate menu costs
      const updatedMenus: OrderMenuData[] = [];
      let menuCost = 0;
      
      for (let i = 0; i < menus.length; i++) {
        const menuItem = menus[i];
        const menuPrice = menuPrices[i]?.cost || 0;
        
        updatedMenus.push({
          ...menuItem,
          price: menuPrice
        });
        
        menuCost += menuItem.quantity * menuPrice;
      }
      
      // Calculate delivery fee based on random factors (distance, etc.)
      const deliveryFee = parseFloat(faker.number.float({ min: 2, max: 8, fractionDigits: 2 }).toFixed(2));
      
      // Add delivery fee to total cost
      const totalCost = dishCost + menuCost + deliveryFee;

      // Ensure customer has an address, fallback to a fake one if not
      const deliveryAddress = customer.address || faker.location.streetAddress();
      
      orders.push({
        customerId: customer.userId,
        restaurantId: restaurant.userId,
        deliveryLocalisation: deliveryAddress,
        time: orderTime,
        cost: parseFloat(totalCost.toFixed(2)),
        deliveryFee: deliveryFee,
        status,
        verificationCode: faker.string.alphanumeric(6).toUpperCase(),
        dishes: updatedDishes,
        menus: updatedMenus,
      });
    }

    return orders;
  }

  async run(): Promise<void> {
    console.log('🌱 Seeding orders...');
    
    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get customers and restaurants
      const [customers, restaurants] = await Promise.all([
        this.userRepository.find({ where: { role: 'customer' } }),
        this.userRepository.find({ where: { role: 'restaurant' } }),
      ]);

      if (customers.length === 0 || restaurants.length === 0) {
        console.warn('⚠️  No customers or restaurants found. Please seed users first.');
        return;
      }

      // Clear existing data safely
      const hasOrderMenus = await this.orderMenuRepository.count() > 0;
      const hasOrderDishes = await this.orderDishRepository.count() > 0;
      const hasOrders = await this.orderRepository.count() > 0;

      if (hasOrderMenus) await this.orderMenuRepository.clear();
      if (hasOrderDishes) await this.orderDishRepository.clear();
      if (hasOrders) await this.orderRepository.clear();

      // Generate sample orders
      const orderData = await this.generateSampleOrders(customers, restaurants);
      
      if (orderData.length === 0) {
        console.warn('⚠️  No orders were generated. Make sure you have dishes and menus seeded.');
        return;
      }

      // Create orders
      for (const orderItem of orderData) {
        // Create the order
        const order = this.orderRepository.create({
          customerId: orderItem.customerId,
          restaurantId: orderItem.restaurantId,
          deliveryLocalisation: orderItem.deliveryLocalisation,
          time: orderItem.time,
          cost: orderItem.cost,
          deliveryFee: orderItem.deliveryFee,
          status: orderItem.status,
          verificationCode: orderItem.verificationCode,
        });

        const savedOrder = await queryRunner.manager.save(order);

        // Add order dishes with personalization choices and price
        for (const dish of orderItem.dishes) {
          const orderDish = this.orderDishRepository.create({
            order: { orderId: savedOrder.orderId },
            dish: { dishId: dish.dishId },
            quantity: dish.quantity,
            price: dish.price, // Include the price field
            personalizationChoices: dish.personalizationChoices || undefined
          });
          await queryRunner.manager.save(OrderDish, orderDish);
        }

        // Add order menus with price
        for (const menu of orderItem.menus) {
          const orderMenu = this.orderMenuRepository.create({
            orderId: savedOrder.orderId,
            menuId: menu.menuId,
            quantity: menu.quantity,
            price: menu.price // Include the price field
          });
          await queryRunner.manager.save(OrderMenu, orderMenu);
        }
      }

      await queryRunner.commitTransaction();
      console.log('✅ Orders seeded successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error seeding orders:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
