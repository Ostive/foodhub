import { DataSource } from 'typeorm';
import { Planning } from '../entities/planning.entity';
import { User } from '../entities/user.entity';

type TimeSlot = {
  open: string;
  close: string;
};

type DailySchedule = {
  isOpen: boolean;
  slots: TimeSlot[];
};

type WeeklySchedule = {
  [key: string]: DailySchedule;
};

export class PlanningSeeder {
  constructor(private dataSource: DataSource) {}

  private generateRandomTime(openingHour: number, maxVariation: number): string {
    const minutes = Math.floor(Math.random() * 60);
    const hour = openingHour + Math.floor(Math.random() * maxVariation);
    return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  private generateRestaurantSchedule(): WeeklySchedule {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const schedule: WeeklySchedule = {};
    
    // Choose a random day to be closed (but not Friday, Saturday, or Sunday)
    const closedDay = Math.floor(Math.random() * 5); // 0-4 (Monday-Thursday)
    
    days.forEach((day, index) => {
      // Close one weekday randomly, otherwise open with standard hours
      const isWeekend = index >= 5; // Saturday or Sunday
      const isClosed = index === closedDay;
      
      if (isClosed) {
        schedule[day] = {
          isOpen: false,
          slots: []
        };
      } else if (isWeekend) {
        // Weekend hours (longer service)
        schedule[day] = {
          isOpen: true,
          slots: [
            {
              open: '11:30',
              close: '15:00'
            },
            {
              open: '18:30',
              close: '23:30'
            }
          ]
        };
      } else {
        // Weekday hours
        schedule[day] = {
          isOpen: true,
          slots: [
            {
              open: '11:30',
              close: '14:30'
            },
            {
              open: '19:00',
              close: '22:30'
            }
          ]
        };
      }
    });

    return schedule;
  }

  private formatPlanningTime(schedule: DailySchedule): string {
    if (!schedule.isOpen || schedule.slots.length === 0) {
      return 'Fermé';
    }
    
    // Use a more compact format: 11h30-14h30/19h-22h30
    return schedule.slots
      .map(slot => {
        const formatTime = (timeStr: string) => 
          timeStr.replace(':', 'h').replace(/:00$/, '');
        return `${formatTime(slot.open)}-${formatTime(slot.close)}`;
      })
      .join('/');
  }

  async run() {
    console.log('📅 Starting restaurant planning seeding...');
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepository = queryRunner.manager.getRepository(User);
      const planningRepository = queryRunner.manager.getRepository(Planning);

      // Get all restaurant users
      const restaurants = await userRepository.find({
        where: { role: 'restaurant' },
        relations: ['planning']
      });

      if (restaurants.length === 0) {
        console.log('⚠️ No restaurant users found in the database');
        return;
      }

      for (const restaurant of restaurants) {
        // Generate a weekly schedule for this restaurant
        const weeklySchedule = this.generateRestaurantSchedule();
        
        // Create or update the planning
        let planning = restaurant.planning;
        if (!planning) {
          planning = new Planning();
          planning.userId = restaurant.userId;
        }

        // Update the planning with the generated schedule
        planning.monday = this.formatPlanningTime(weeklySchedule.monday);
        planning.tuesday = this.formatPlanningTime(weeklySchedule.tuesday);
        planning.wednesday = this.formatPlanningTime(weeklySchedule.wednesday);
        planning.thursday = this.formatPlanningTime(weeklySchedule.thursday);
        planning.friday = this.formatPlanningTime(weeklySchedule.friday);
        planning.saturday = this.formatPlanningTime(weeklySchedule.saturday);
        planning.sunday = this.formatPlanningTime(weeklySchedule.sunday);

        await planningRepository.save(planning);
        console.log(`✅ Generated planning for ${restaurant.firstName}`);
      }
      
      await queryRunner.commitTransaction();
      console.log('✅ Successfully seeded restaurant plannings');
    } catch (error) {
      console.error('❌ Error seeding restaurant plannings:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
