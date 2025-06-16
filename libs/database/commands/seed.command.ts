import { Command, CommandRunner, Option } from 'nest-commander';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MainFactory } from '../factories/main.factory';
import { createUser } from '../factories/user.factory';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
@Command({ name: 'seed', description: 'Seed the database with initial data' })
export class SeedCommand extends CommandRunner {
  constructor(private dataSource: DataSource) {
    super();
  }

  async run(
    passedParams: string[],
    options?: { users?: number },
  ): Promise<void> {
    try {
      console.log('🌱 Starting database seeding...');
      
      // Use the existing factory structure
      const mainFactory = new MainFactory(this.dataSource);
      const userCount = options?.users || 10;
      
      console.log(`📊 Seeding ${userCount} users...`);
      await mainFactory.seedUsers(userCount);
      
      console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error during database seeding:', error);
      console.error(error);
    }
  }

  @Option({
    flags: '-u, --users [number]',
    description: 'Number of users to seed',
  })
  parseUsers(val: string): number {
    return Number(val);
  }
}
