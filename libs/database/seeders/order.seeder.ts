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
  specialInstructions?: string;
  personalizationChoices?: OrderDishChoice[];
};

type OrderMenuData = {
  menuId: number;
  quantity: number;
  specialInstructions?: string;
};

type OrderData = {
  customerId: number;
  restaurantId: number;
  deliveryLocalisation: string;
  time: Date;
  cost: number;
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

    // Get all existing dish and menu IDs
    // Only get dishes that can be sold alone
    const sellableDishes = await this.dishRepository.find({ 
      where: { isSoldAlone: true },
      select: ['dishId']
    });
    const dishIds = sellableDishes.map(dish => dish.dishId);
    
    const menuIds = (await this.menuRepository.find({ select: ['menuId'] })).map(menu => menu.menuId);

    if (dishIds.length === 0 || menuIds.length === 0) {
      console.warn('⚠️  No sellable dishes or menus found. Please seed dishes (with isSoldAlone: true) and menus first.');
      return [];
    }

    // Generate 5-10 sample orders (fewer to ensure we have enough dishes/menus)
    const orderCount = faker.number.int({ min: 5, max: 10 });

    for (let i = 0; i < orderCount; i++) {
      const customer = faker.helpers.arrayElement(customers);
      const restaurant = faker.helpers.arrayElement(restaurants);
      const status = faker.helpers.arrayElement(statuses);
      const orderTime = faker.date.recent({ days: 30 });

      // Generate 1-2 dishes and 0-1 menus per order (fewer to avoid running out of unique IDs)
      const dishCount = Math.min(faker.number.int({ min: 1, max: 2 }), dishIds.length);
      const menuCount = menuIds.length > 0 ? faker.number.int({ min: 0, max: 1 }) : 0;

      // Shuffle and take unique dish IDs
      const selectedDishIds = faker.helpers.shuffle([...dishIds]).slice(0, dishCount);
      const dishes: OrderDishData[] = selectedDishIds.map(dishId => ({
        dishId,
        quantity: faker.number.int({ min: 1, max: 3 })
      }));
      
      // Shuffle and take unique menu IDs
      const selectedMenuIds = menuCount > 0 
        ? faker.helpers.shuffle([...menuIds]).slice(0, menuCount)
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
      
      // Get menu prices
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
        
        // Update the dish with personalization choices
        updatedDishes.push({
          ...item,
          personalizationChoices: personalizationChoices.length > 0 ? personalizationChoices : undefined
        });
        
        dishCost += item.quantity * itemCost;
      }
      
      // Calculate menu costs
      const menuCost = menus.reduce((sum, item, index) => {
        const price = menuPrices[index]?.cost || 0;
        return sum + (item.quantity * price);
      }, 0);
      
      const totalCost = dishCost + menuCost;

      // Ensure customer has an address, fallback to a fake one if not
      const deliveryAddress = customer.address || faker.location.streetAddress();
      
      orders.push({
        customerId: customer.userId,
        restaurantId: restaurant.userId,
        deliveryLocalisation: deliveryAddress,
        time: orderTime,
        cost: parseFloat(totalCost.toFixed(2)),
        status,
        verificationCode: faker.string.alphanumeric(6).toUpperCase(),
        dishes: updatedDishes,
        menus,
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
          status: orderItem.status,
          verificationCode: orderItem.verificationCode,
        });

        const savedOrder = await queryRunner.manager.save(order);

        // Add order dishes with personalization choices
        for (const dish of orderItem.dishes) {
          const orderDish = this.orderDishRepository.create({
            order: { orderId: savedOrder.orderId },
            dish: { dishId: dish.dishId },
            quantity: dish.quantity,
            personalizationChoices: dish.personalizationChoices || undefined
          });
          await queryRunner.manager.save(OrderDish, orderDish);
        }

        // Add order menus
        for (const menu of orderItem.menus) {
          const orderMenu = this.orderMenuRepository.create({
            orderId: savedOrder.orderId,
            menuId: menu.menuId,
            quantity: menu.quantity
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
