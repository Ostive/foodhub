import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export class UserSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);
    const users: User[] = [];

    // Helper to create users by role
    const createUsers = async (role: User['role'], count: number) => {
      for (let i = 1; i <= count; i++) {
        const user = new User();
        
        if (role === 'restaurant') {
          const restaurantNames = [
            'La Belle Équipe', 'Le Petit Bistrot', 'Chez Paul', 'La Table Ronde', 'Le Jardin Secret',
            'La Petite Auberge', 'Le Bistrot du Coin', 'La Cantine Moderne', 'Le Comptoir du Marché', 'Le Temps des Cerises',
            'Le Bistrot Parisien', 'La Maison du Gourmet', 'Le Petit Gourmand', 'La Table du Chef', 'Le Café de la Paix',
            'Le Saint Germain', 'Le Marais', 'Le Petit Prince', 'La Fontaine des Saveurs', 'Les Délices de Toulouse'
          ];
          // Get unique restaurant name by index to avoid duplicates
          const restaurantName = restaurantNames[(i - 1) % restaurantNames.length];
          const uniqueSuffix = Math.floor(i / restaurantNames.length) > 0 ? i : '';
          
          user.firstName = restaurantName + (uniqueSuffix ? ` ${uniqueSuffix}` : '');
          user.lastName = 'Restaurant';
          user.email = `${restaurantName.toLowerCase().replace(/\s+/g, '.')}${uniqueSuffix}@restaurant.com`;
          // Generate Toulouse addresses for restaurants
          const toulouseStreets = [
            'Rue de Metz',
            'Allées Jean Jaurès',
            'Rue d\'Alsace-Lorraine',
            'Place du Capitole',
            'Rue de la Pomme',
            'Rue Saint-Rome',
            'Rue des Filatiers',
            'Rue du Taur',
            'Rue Saint-Antoine du T',
            'Rue des Lois',
            'Rue de la Bourse',
            'Rue des Tourneurs'
          ];
          const toulouseZipCodes = ['31000', '31100', '31200', '31300', '31400', '31500'];
          const streetNumber = faker.number.int({ min: 1, max: 200 });
          const street = toulouseStreets[(i - 1) % toulouseStreets.length];
          const zipCode = toulouseZipCodes[(i - 1) % toulouseZipCodes.length];
          const city = 'Toulouse';
          user.address = `${streetNumber} ${street}, ${zipCode} ${city}, France`;
          
          user.phone = `0${faker.number.int({ min: 1, max: 9 })}${faker.string.numeric(8)}`;
          user.birthDate = faker.date.between({ from: '1970-01-01', to: '2005-01-01' });
          user.website = `https://${restaurantName.toLowerCase().replace(/\s+/g, '-')}.com`;
          user.rib = `FR76${faker.finance.accountNumber(18)}`;
          user.deliveryRadius = faker.number.int({ min: 5, max: 20 });
          user.averagePreparationTime = faker.number.int({ min: 15, max: 60 });
          user.minimumPurchase = faker.number.float({ min: 10, max: 30, fractionDigits: 2 });
          user.tags = [faker.helpers.arrayElement(['pizza', 'burger', 'sushi', 'pasta', 'dessert'])];
        } else {
          user.firstName = faker.person.firstName();
          user.lastName = faker.person.lastName();
          user.email = `${role}${i}@example.com`;
          user.phone = `0${faker.number.int({ min: 1, max: 9 })}${faker.string.numeric(8)}`;
          user.birthDate = faker.date.between({ from: '1970-01-01', to: '2005-01-01' });
          
          // Generate Toulouse addresses
          const toulouseStreets = [
            'Rue de Metz',
            'Allées Jean Jaurès',
            'Rue d\'Alsace-Lorraine',
            'Place du Capitole',
            'Rue de la Pomme',
            'Rue Saint-Rome',
            'Rue des Filatiers',
            'Rue du Taur',
            'Rue Saint-Antoine du T',
            'Rue des Lois',
            'Rue de la Bourse',
            'Rue des Tourneurs'
          ];
          const toulouseZipCodes = ['31000', '31100', '31200', '31300', '31400', '31500'];
          const streetNumber = faker.number.int({ min: 1, max: 200 });
          const street = faker.helpers.arrayElement(toulouseStreets);
          const zipCode = faker.helpers.arrayElement(toulouseZipCodes);
          const city = 'Toulouse';
          user.address = `${streetNumber} ${street}, ${zipCode} ${city}, France`;
          
          // Add transport for delivery persons
          if (role === 'delivery_person') {
            const transports = ['bike', 'scooter', 'car'];
            user.transport = faker.helpers.arrayElement(transports);
          }
        }
        
        // Set common fields for all users
        user.password = await bcrypt.hash('password123', 10);
        user.role = role;
        
        // Additional fields for restaurants
        if (role === 'restaurant') {
          user.website = faker.internet.url();
          user.rib = faker.finance.iban();
          user.deliveryRadius = faker.number.float({ min: 1, max: 20, fractionDigits: 1 });
          user.averagePreparationTime = faker.number.int({ min: 10, max: 60 });
          user.minimumPurchase = faker.number.float({ min: 10, max: 50, fractionDigits: 2 });
          user.tags = ['italian', 'pizza', 'pasta', 'french', 'burger', 'sushi', 'vegan', 'dessert']
            .sort(() => 0.5 - Math.random())
            .slice(0, faker.number.int({ min: 1, max: 3 }));
        }
        
        // Additional fields for delivery persons
        if (role === 'delivery_person') {
          user.transport = faker.helpers.arrayElement(['bike', 'scooter', 'car']);
        }

        users.push(user);
      }
    };

    // Create 10 customers
    await createUsers('customer', 10);

    // Create 2 developers
    await createUsers('developer', 2);

    // Create 5 delivery persons (note the correct role name)
    await createUsers('delivery_person', 5);

    // Create 10 restaurants
    await createUsers('restaurant', 10);

    // Add a default admin
    const adminUser = new User();
    adminUser.firstName = 'Admin';
    adminUser.lastName = 'User';
    adminUser.email = 'admin@example.com';
    adminUser.phone = `0${faker.number.int({ min: 1, max: 9 })}${faker.string.numeric(8)}`;
    adminUser.birthDate = new Date('1990-01-01');
    adminUser.address = `1 Place du Capitole, 31000 Toulouse, France`;
    adminUser.role = 'admin';
    adminUser.password = await bcrypt.hash('admin123', 10);
    users.push(adminUser);

    await userRepository.save(users);
    console.log(`✅ Created ${users.length} users: 10 customers, 2 developers, 5 delivery persons, 10 restaurants, 1 admin`);
  }
}