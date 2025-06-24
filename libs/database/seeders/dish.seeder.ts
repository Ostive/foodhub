import { DataSource } from 'typeorm';
import { Dish } from '../entities/dish.entity';
import { User } from '../entities/user.entity';
import { PersonalizationOption } from '../entities/personalization-option.entity';
import { PersonalizationOptionChoice } from '../entities/personalization-option-choice.entity';

type DishData = {
  name: string;
  description: string;
  cost: number;
  category: string;
  picture?: string;
  isSoldAlone?: boolean;
  personalizationOptions?: Array<{
    name: string;
    type: 'single' | 'multiple';
    required: boolean;
    choices: Array<{
      name: string;
      additionalPrice: number;
      isDefault: boolean;
    }>;
  }>;
};

export class DishSeeder {
  constructor(private dataSource: DataSource) {}

  private getDishData(restaurantName: string): DishData[] {
    // Common dishes that can appear in multiple restaurants
    const commonDishes: DishData[] = [
      {
        name: 'House Bread Basket',
        description: 'Freshly baked assortment of breads with herb butter',
        cost: 4.99,
        category: 'Starter',
        picture: 'https://static.vecteezy.com/system/resources/previews/005/007/528/non_2x/restaurant-food-kitchen-line-icon-illustration-logo-template-suitable-for-many-purposes-free-vector.jpg'
      },
      {
        name: 'Seasonal Sorbet',
        description: 'Refreshing sorbet made with seasonal fruits',
        cost: 5.50,
        category: 'Dessert',
        isSoldAlone: false, // Example of a dish that can't be sold alone
        personalizationOptions: [
          {
            name: 'Flavor',
            type: 'single',
            required: true,
            choices: [
              { name: 'Lemon Basil', additionalPrice: 0, isDefault: true },
              { name: 'Raspberry Mint', additionalPrice: 0, isDefault: false },
              { name: 'Mango Chili', additionalPrice: 1.00, isDefault: false }
            ]
          }
        ]
      }
    ];

    // Restaurant-specific dishes
    const restaurantSpecificDishes: Record<string, DishData[]> = {
      // French Bistro
      'La Belle Équipe': [
        {
          name: 'Soupe à l\'Oignon',
          description: 'Classic French onion soup with gruyère crouton',
          cost: 8.99,
          category: 'Starter',
          personalizationOptions: [
            {
              name: 'Cheese',
              type: 'single',
              required: true,
              choices: [
                { name: 'Gruyère', additionalPrice: 0, isDefault: true },
                { name: 'Comté', additionalPrice: 1.50, isDefault: false },
                { name: 'Extra Cheese', additionalPrice: 2.00, isDefault: false }
              ]
            }
          ]
        },
        {
          name: 'Duck Confit',
          description: 'Slow-cooked duck leg with garlic potatoes and seasonal vegetables',
          cost: 24.99,
          category: 'Main Course',
          personalizationOptions: [
            {
              name: 'Doneness',
              type: 'single',
              required: true,
              choices: [
                { name: 'Medium Rare', additionalPrice: 0, isDefault: true },
                { name: 'Medium', additionalPrice: 0, isDefault: false },
                { name: 'Well Done', additionalPrice: 0, isDefault: false }
              ]
            },
            {
              name: 'Sauce',
              type: 'single',
              required: false,
              choices: [
                { name: 'Red Wine Reduction', additionalPrice: 1.50, isDefault: true },
                { name: 'Orange Grand Marnier', additionalPrice: 2.00, isDefault: false },
                { name: 'Green Peppercorn', additionalPrice: 1.50, isDefault: false }
              ]
            }
          ]
        },
        {
          name: 'Tarte Tatin',
          description: 'Caramelized apple tart with vanilla ice cream',
          cost: 9.50,
          category: 'Dessert',
          personalizationOptions: [
            {
              name: 'Ice Cream Flavor',
              type: 'single',
              required: true,
              choices: [
                { name: 'Vanilla', additionalPrice: 0, isDefault: true },
                { name: 'Salted Caramel', additionalPrice: 1.00, isDefault: false },
                { name: 'Cinnamon', additionalPrice: 0.50, isDefault: false }
              ]
            }
          ]
        },
        {
          name: 'Cheese Board',
          description: 'Selection of French cheeses with fig jam and walnut bread',
          cost: 18.99,
          category: 'Dessert',
          personalizationOptions: [
            {
              name: 'Cheese Selection',
              type: 'multiple',
              required: true,
              choices: [
                { name: 'Brie de Meaux', additionalPrice: 2.00, isDefault: true },
                { name: 'Roquefort', additionalPrice: 2.50, isDefault: true },
                { name: 'Comté 24-month', additionalPrice: 3.00, isDefault: false },
                { name: 'Chèvre', additionalPrice: 2.00, isDefault: true },
                { name: 'Munster', additionalPrice: 2.00, isDefault: false }
              ]
            }
          ]
        }
      ],
      
      // Italian Trattoria
      'Le Petit Bistrot': [
        {
          name: 'Truffle Arancini',
          description: 'Crispy risotto balls with black truffle and mozzarella',
          cost: 10.99,
          category: 'Starter',
          personalizationOptions: [
            {
              name: 'Sauce',
              type: 'single',
              required: true,
              choices: [
                { name: 'Marinara', additionalPrice: 0, isDefault: true },
                { name: 'Truffle Aioli', additionalPrice: 1.00, isDefault: false },
                { name: 'Spicy Arrabbiata', additionalPrice: 0.50, isDefault: false }
              ]
            }
          ]
        },
        {
          name: 'Pappardelle al Cinghiale',
          description: 'Wide ribbon pasta with wild boar ragù and aged pecorino',
          cost: 22.50,
          category: 'Pasta',
          personalizationOptions: [
            {
              name: 'Pasta Type',
              type: 'single',
              required: true,
              choices: [
                { name: 'Pappardelle', additionalPrice: 0, isDefault: true },
                { name: 'Tagliatelle', additionalPrice: 0, isDefault: false },
                { name: 'Penne', additionalPrice: 0, isDefault: false }
              ]
            },
            {
              name: 'Spice Level',
              type: 'single',
              required: true,
              choices: [
                { name: 'Mild', additionalPrice: 0, isDefault: true },
                { name: 'Medium', additionalPrice: 0, isDefault: false },
                { name: 'Spicy', additionalPrice: 0, isDefault: false }
              ]
            }
          ]
        },
        {
          name: 'Tiramisu Classico',
          description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
          cost: 8.99,
          category: 'Dessert',
          personalizationOptions: [
            {
              name: 'Coffee Strength',
              type: 'single',
              required: true,
              choices: [
                { name: 'Regular', additionalPrice: 0, isDefault: true },
                { name: 'Extra Coffee', additionalPrice: 0.50, isDefault: false },
                { name: 'Decaf', additionalPrice: 0, isDefault: false }
              ]
            },
            {
              name: 'Add Liqueur',
              type: 'single',
              required: false,
              choices: [
                { name: 'None', additionalPrice: 0, isDefault: true },
                { name: 'Kahlúa', additionalPrice: 2.50, isDefault: false },
                { name: 'Amaretto', additionalPrice: 2.50, isDefault: false },
                { name: 'Baileys', additionalPrice: 3.00, isDefault: false }
              ]
            }
          ]
        }
      ],

      // Vegetarian/Vegan
      'Le Jardin Secret': [
        {
          name: 'Rainbow Buddha Bowl',
          description: 'Quinoa, roasted vegetables, avocado, pickled vegetables, and tahini dressing',
          cost: 16.99,
          category: 'Main Course',
          personalizationOptions: [
            {
              name: 'Base',
              type: 'single',
              required: true,
              choices: [
                { name: 'Quinoa', additionalPrice: 0, isDefault: true },
                { name: 'Brown Rice', additionalPrice: 0, isDefault: false },
                { name: 'Mixed Greens', additionalPrice: 0, isDefault: false }
              ]
            },
            {
              name: 'Protein',
              type: 'single',
              required: false,
              choices: [
                { name: 'None', additionalPrice: 0, isDefault: true },
                { name: 'Crispy Tofu', additionalPrice: 3.50, isDefault: false },
                { name: 'Grilled Tempeh', additionalPrice: 3.00, isDefault: false },
                { name: 'Chickpeas', additionalPrice: 2.00, isDefault: false }
              ]
            },
            {
              name: 'Dressing',
              type: 'single',
              required: true,
              choices: [
                { name: 'Tahini Lemon', additionalPrice: 0, isDefault: true },
                { name: 'Miso Ginger', additionalPrice: 0, isDefault: false },
                { name: 'Balsamic Vinaigrette', additionalPrice: 0, isDefault: false },
                { name: 'On the side', additionalPrice: 0, isDefault: false }
              ]
            }
          ]
        },
        {
          name: 'Mushroom Risotto',
          description: 'Creamy arborio rice with wild mushrooms, white wine, and truffle oil',
          cost: 19.99,
          category: 'Main Course',
          personalizationOptions: [
            {
              name: 'Mushroom Mix',
              type: 'multiple',
              required: true,
              choices: [
                { name: 'Shiitake', additionalPrice: 2.00, isDefault: true },
                { name: 'Oyster', additionalPrice: 2.00, isDefault: true },
                { name: 'Chanterelle', additionalPrice: 3.50, isDefault: false },
                { name: 'Porcini', additionalPrice: 4.00, isDefault: false },
                { name: 'Truffle Shavings', additionalPrice: 6.00, isDefault: false }
              ]
            },
            {
              name: 'Cheese',
              type: 'single',
              required: true,
              choices: [
                { name: 'Parmesan (contains dairy)', additionalPrice: 0, isDefault: true },
                { name: 'Nutritional Yeast (vegan)', additionalPrice: 1.00, isDefault: false },
                { name: 'None', additionalPrice: 0, isDefault: false }
              ]
            }
          ]
        },
        {
          name: 'Chocolate Avocado Mousse',
          description: 'Rich and creamy vegan chocolate mousse with raspberry coulis',
          cost: 8.50,
          category: 'Dessert',
          personalizationOptions: [
            {
              name: 'Toppings',
              type: 'multiple',
              required: false,
              choices: [
                { name: 'Fresh Berries', additionalPrice: 1.50, isDefault: true },
                { name: 'Toasted Nuts', additionalPrice: 1.00, isDefault: false },
                { name: 'Coconut Whipped Cream', additionalPrice: 1.50, isDefault: false },
                { name: 'Sea Salt Flakes', additionalPrice: 0.50, isDefault: false }
              ]
            }
          ]
        },
        {
          name: 'Golden Milk Latte',
          description: 'Warm turmeric and spice-infused plant milk with a hint of black pepper',
          cost: 5.50,
          category: 'Beverage',
          personalizationOptions: [
            {
              name: 'Milk',
              type: 'single',
              required: true,
              choices: [
                { name: 'Oat Milk', additionalPrice: 0, isDefault: true },
                { name: 'Almond Milk', additionalPrice: 0, isDefault: false },
                { name: 'Coconut Milk', additionalPrice: 0.50, isDefault: false },
                { name: 'Soy Milk', additionalPrice: 0, isDefault: false }
              ]
            },
            {
              name: 'Sweetener',
              type: 'single',
              required: false,
              choices: [
                { name: 'Maple Syrup', additionalPrice: 0, isDefault: true },
                { name: 'Agave', additionalPrice: 0, isDefault: false },
                { name: 'Honey (not vegan)', additionalPrice: 0, isDefault: false },
                { name: 'None', additionalPrice: 0, isDefault: false }
              ]
            }
          ]
        }
      ]
    };

    // Combine common dishes with restaurant-specific ones if they exist
    return [
      ...commonDishes,
      ...(restaurantSpecificDishes[restaurantName] || [])
    ];
  }

  private async createDish(user: User, dishData: DishData) {
    const dishRepository = this.dataSource.getRepository(Dish);
    const optionRepository = this.dataSource.getRepository(PersonalizationOption);
    const choiceRepository = this.dataSource.getRepository(PersonalizationOptionChoice);
    
    const dish = new Dish();
    dish.name = dishData.name;
    dish.description = dishData.description;
    dish.cost = dishData.cost;
    dish.picture = dishData.picture || 'https://static.vecteezy.com/system/resources/previews/005/007/528/non_2x/restaurant-food-kitchen-line-icon-illustration-logo-template-suitable-for-many-purposes-free-vector.jpg';
    dish.user = user;
    dish.userId = user.userId;
    dish.isSoldAlone = dishData.isSoldAlone !== false; // Default to true if not specified
    dish.isVegetarian = dishData.name.toLowerCase().includes('vegetarian') || 
                      dishData.name.toLowerCase().includes('salad');
    dish.spicyLevel = dishData.name.toLowerCase().includes('spicy') ? 3 : 0;
    dish.tags = [dishData.category.toLowerCase()];
    
    await dishRepository.save(dish);
    
    // Add personalization options if they exist
    if (dishData.personalizationOptions) {
      for (const optionData of dishData.personalizationOptions) {
        const option = new PersonalizationOption();
        option.name = optionData.name;
        option.type = optionData.type;
        option.required = optionData.required;
        option.dish = dish;
        
        await optionRepository.save(option);
        
        // Add choices for this option
        for (const choiceData of optionData.choices) {
          const choice = new PersonalizationOptionChoice();
          choice.name = choiceData.name;
          choice.additionalPrice = choiceData.additionalPrice;
          choice.isDefault = choiceData.isDefault;
          choice.option = option;
          
          await choiceRepository.save(choice);
        }
      }
    }
    
    console.log(`🍽️  Added ${dish.name} to ${user.firstName}`);
  }

  async run() {
    console.log('🌱 Seeding dishes...');
    
    const userRepository = this.dataSource.getRepository(User);
    
    // Get all restaurants
    const restaurants = await userRepository.find({
      where: { role: 'restaurant' },
      relations: ['dishes']
    });

    for (const restaurant of restaurants) {
      const dishesData = this.getDishData(restaurant.firstName);
      
      for (const dishData of dishesData) {
        await this.createDish(restaurant, dishData);
      }
    }
    
    console.log('✅ Dishes seeded successfully!');
  }
}
