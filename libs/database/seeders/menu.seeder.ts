import { DataSource } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { MenuDish } from '../entities/menu_dish.entity';
import { User } from '../entities/user.entity';
import { Dish } from '../entities/dish.entity';

// Extended Dish type with category for internal use
type DishWithCategory = Dish & {
  category: string;
};

interface MenuDishData {
  dishId: number;
  isMain: boolean;
  differCost: number | null;
}

type MenuData = {
  name: string;
  description: string;
  cost: number;
  picture?: string;
  tags: string[];
  isVegetarian: boolean;
  dishes: MenuDishData[];
};

export class MenuSeeder {
  constructor(private dataSource: DataSource) {}

  private async createMenuForRestaurant(restaurant: User, dishes: DishWithCategory[]): Promise<MenuData[]> {
    const menus: MenuData[] = [];
    
    // Group dishes by category
    const dishesByCategory = dishes.reduce((acc, dish) => {
      if (!acc[dish.category]) {
        acc[dish.category] = [];
      }
      acc[dish.category].push(dish);
      return acc;
    }, {} as Record<string, DishWithCategory[]>);

    // Create a lunch menu
    const starters = dishesByCategory['Starter'] || [];
    const mainCourses = dishesByCategory['Main Course'] || [];
    const pastas = dishesByCategory['Pasta'] || [];
    const desserts = dishesByCategory['Dessert'] || [];
    const beverages = dishesByCategory['Beverage'] || [];

    // Lunch Menu (Starter + Main + Dessert)
    if (starters.length > 0 && (mainCourses.length > 0 || pastas.length > 0) && desserts.length > 0) {
      const starter = starters[Math.floor(Math.random() * starters.length)];
      const main = (mainCourses.length > 0 ? mainCourses : pastas)[0];
      const dessert = desserts[0];
      
      const menuCost = Math.round((starter.cost + main.cost + dessert.cost) * 0.9); // 10% discount
      
      menus.push({
        name: 'Menu Déjeuner',
        description: 'Formule complète avec entrée, plat et dessert',
        cost: menuCost,
        picture: 'https://cdn-icons-png.flaticon.com/512/1046/1046849.png',
        tags: ['lunch', 'set-menu'],
        isVegetarian: starter.isVegetarian && main.isVegetarian && dessert.isVegetarian,
        dishes: [
          { dishId: starter.dishId, isMain: false, differCost: null },
          { dishId: main.dishId, isMain: true, differCost: null },
          { dishId: dessert.dishId, isMain: false, differCost: null }
        ]
      });
    }

    // Pasta Menu (Pasta + Side + Drink)
    if (pastas.length > 0 && (starters.length > 0 || desserts.length > 0) && beverages.length > 0) {
      const pasta = pastas[0];
      const side = [...starters, ...desserts].filter(d => d.dishId !== pasta.dishId)[0];
      const drink = beverages[0];
      
      const menuCost = Math.round((pasta.cost + (side?.cost || 0) + drink.cost) * 0.85); // 15% discount
      
      menus.push({
        name: 'Menu Pâtes',
        description: 'Un délicieux plat de pâtes accompagné et une boisson',
        cost: menuCost,
        picture: 'https://cdn-icons-png.flaticon.com/512/1046/1046849.png',
        tags: ['pasta', 'italian'],
        isVegetarian: pasta.isVegetarian && (!side || side.isVegetarian),
        dishes: [
          { dishId: pasta.dishId, isMain: true, differCost: null },
          ...(side ? [{ dishId: side.dishId, isMain: false, differCost: null }] : []),
          { dishId: drink.dishId, isMain: false, differCost: null }
        ]
      });
    }

    // Vegetarian Menu (All veg dishes)
    const vegetarianDishes = dishes.filter(d => d.isVegetarian);
    if (vegetarianDishes.length >= 2) {
      const vegStarter = vegetarianDishes.find(d => d.category === 'Starter');
      const vegMain = vegetarianDishes.find(d => d.category === 'Main Course' || d.category === 'Pasta');
      const vegDessert = vegetarianDishes.find(d => d.category === 'Dessert');
      
      if (vegStarter && vegMain) {
        const menuDishes: MenuDishData[] = [
          { dishId: vegStarter.dishId, isMain: false, differCost: null },
          { dishId: vegMain.dishId, isMain: true, differCost: null }
        ];
        
        if (vegDessert) {
          menuDishes.push({ dishId: vegDessert.dishId, isMain: false, differCost: null });
        }
        
        const baseCost = menuDishes.reduce((sum, { dishId }) => {
          const dish = dishes.find(d => d.dishId === dishId);
          return sum + (dish?.cost || 0);
        }, 0);
        
        menus.push({
          name: 'Menu Végétarien',
          description: 'Une sélection de nos meilleurs plats végétariens',
          cost: Math.round(baseCost * 0.9), // 10% discount
          picture: 'https://cdn-icons-png.flaticon.com/512/1046/1046849.png',
          tags: ['vegetarian', 'healthy'],
          isVegetarian: true,
          dishes: menuDishes
        });
      }
    }

    // Chef's Special Menu (Most expensive dishes)
    const sortedDishes = [...dishes].sort((a, b) => b.cost - a.cost);
    if (sortedDishes.length >= 2) {
      const specialDishes = sortedDishes.slice(0, 3);
      const baseCost = specialDishes.reduce((sum, dish) => sum + dish.cost, 0);
      
      menus.push({
        name: 'Menu Découverte',
        description: 'La sélection du chef avec nos plats les plus raffinés',
        cost: Math.round(baseCost * 0.85), // 15% discount
        picture: 'https://cdn-icons-png.flaticon.com/512/1046/1046849.png',
        tags: ['chef', 'special', 'gourmet'],
        isVegetarian: specialDishes.every(d => d.isVegetarian),
        dishes: specialDishes.map((dish, index): MenuDishData => ({
          dishId: dish.dishId,
          isMain: index === 1, // Second most expensive is the main
          differCost: null
        }))
      });
    }

    return menus;
  }

  async run() {
    console.log('📋 Seeding menus...');
    
    const menuRepository = this.dataSource.getRepository(Menu);
    const menuDishRepository = this.dataSource.getRepository(MenuDish);
    const userRepository = this.dataSource.getRepository(User);
    const dishRepository = this.dataSource.getRepository(Dish);

    // Get all restaurants with their dishes
    const restaurants = await userRepository.find({
      where: { role: 'restaurant' },
      relations: ['dishes']
    });

    for (const restaurant of restaurants) {
      if (!restaurant.dishes || restaurant.dishes.length === 0) {
        console.log(`⚠️  No dishes found for ${restaurant.firstName}, skipping menu creation`);
        continue;
      }

      console.log(`🍽️  Creating menus for ${restaurant.firstName}...`);
      
      // Get all dishes for this restaurant
      const dishes = (await dishRepository.find({
        where: { user: { userId: restaurant.userId } },
        relations: ['user']
      })).map(dish => ({
        ...dish,
        // Add a category property based on dish name
        category: this.getDishCategory(dish.name)
      }));

      if (dishes.length === 0) {
        console.log(`⚠️  No dishes found for ${restaurant.firstName} in database, skipping`);
        continue;
      }

      // Create menus for this restaurant
      const menuDataList = await this.createMenuForRestaurant(restaurant, dishes);
      
      for (const menuData of menuDataList) {
        // Create the menu
        const menu = new Menu();
        menu.name = menuData.name;
        menu.description = menuData.description;
        menu.cost = menuData.cost;
        menu.picture = menuData.picture || 'https://cdn-icons-png.flaticon.com/512/1046/1046849.png';
        menu.tags = menuData.tags;
        menu.isVegetarian = menuData.isVegetarian;
        menu.user = restaurant;
        
        // Save the menu
        const savedMenu = await menuRepository.save(menu);
        
        // Add dishes to the menu
        for (const menuDishData of menuData.dishes) {
          const menuDish = new MenuDish();
          menuDish.menuId = savedMenu.menuId;
          menuDish.dishId = menuDishData.dishId;
          // Handle potential null/undefined for differCost
        menuDish.differCost = menuDishData.differCost !== undefined && menuDishData.differCost !== null 
          ? Number(menuDishData.differCost) 
          : null;
          
          await menuDishRepository.save(menuDish);
        }
        
        console.log(`✅ Created menu: ${savedMenu.name} (${savedMenu.cost}€)`);
      }
    }
    
    console.log('🎉 Menus seeded successfully!');
  }

  // Helper method to determine dish category based on name
  private getDishCategory(dishName: string): string {
    const name = dishName.toLowerCase();
    
    if (name.includes('salad') || name.includes('soup') || name.includes('starter')) {
      return 'Starter';
    } else if (name.includes('pasta') || name.includes('risotto') || name.includes('noodle')) {
      return 'Pasta';
    } else if (name.includes('dessert') || name.includes('mousse') || name.includes('tart') || name.includes('cake')) {
      return 'Dessert';
    } else if (name.includes('coffee') || name.includes('tea') || name.includes('latte') || name.includes('drink')) {
      return 'Beverage';
    } else if (name.includes('pizza') || name.includes('burger') || name.includes('sandwich')) {
      return 'Main Course';
    }
    return 'Main Course'; // Default category
  }
}
