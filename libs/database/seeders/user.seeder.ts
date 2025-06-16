import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { createUser } from '../factories/user.factory';
import * as bcrypt from 'bcrypt';

export class UserSeeder {
  constructor(private dataSource: DataSource) {}

  async run(count: number = 10): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);
    
    // Create users
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      const user = createUser();
      // Hash the password
      user.password = await bcrypt.hash(user.password, 10);
      users.push(user);
    }

    // Add a default admin user for testing
    const adminUser = new User();
    adminUser.name = 'Admin User';
    adminUser.email = 'admin@example.com';
    adminUser.password = await bcrypt.hash('admin123', 10);
    adminUser.role = 'admin';
    users.push(adminUser);

    // Add a default customer user for testing
    const customerUser = new User();
    customerUser.name = 'Customer User';
    customerUser.email = 'customer@example.com';
    customerUser.password = await bcrypt.hash('customer123', 10);
    customerUser.role = 'customer';
    users.push(customerUser);

    // Save all users
    await userRepository.save(users);
    console.log(`✅ Created ${users.length} users`);
  }
}