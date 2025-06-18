import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker/locale/fr';
import { CreditCard } from '../entities/credit_card.entity';
import { User } from '../entities/user.entity';

export class CreditCardSeeder {
  constructor(private dataSource: DataSource) {}

  private generateCreditCardNumber(): string {
    // Generate a random 16-digit credit card number (for testing purposes only)
    return Array.from({ length: 4 }, () => 
      Math.floor(1000 + Math.random() * 9000)
    ).join('');
  }

  private generateExpiryDate(): string {
    // Generate a random future expiry date in MM/YY format
    const now = new Date();
    const month = String(now.getMonth() + 1 + Math.floor(Math.random() * 12)).padStart(2, '0');
    const year = String(now.getFullYear() % 100 + 1 + Math.floor(Math.random() * 5));
    return `${month}/${year}`;
  }

  async run() {
    console.log('💳 Starting credit card seeding...');
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepository = queryRunner.manager.getRepository(User);
      const creditCardRepository = queryRunner.manager.getRepository(CreditCard);

      // Get all customer users
      const customers = await userRepository.find({
        where: { role: 'customer' },
        take: 20 // Limit to 20 customers to avoid too many cards
      });

      if (customers.length === 0) {
        console.log('⚠️ No customer users found in the database');
        return;
      }

      const creditCards: Partial<CreditCard>[] = [];
      
      // Generate 1-3 credit cards per customer
      for (const customer of customers) {
        const cardCount = Math.floor(Math.random() * 3) + 1; // 1-3 cards per customer
        
        for (let i = 0; i < cardCount; i++) {
          const cardholderName = faker.person.fullName();
          
          creditCards.push({
            userId: customer.userId,
            creditCardNumber: this.generateCreditCardNumber(),
            expiryDate: this.generateExpiryDate(),
            name: cardholderName,
            user: customer
          });
        }
      }

      // Save all credit cards
      await creditCardRepository.save(creditCards);
      
      await queryRunner.commitTransaction();
      console.log(`✅ Successfully seeded ${creditCards.length} credit cards`);
    } catch (error) {
      console.error('❌ Error seeding credit cards:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
