import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AuthGuard } from '../guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  @Get()
  @Roles('admin')
  getAdminDashboard() {
    return { message: 'Welcome to the admin dashboard!' };
  }

  @Get('stats')
  @Roles('admin')
  getAdminStats() {
    return { 
      message: 'Admin statistics', 
      stats: {
        users: 100,
        activeUsers: 75,
        newUsersToday: 5
      }
    };
  }
}
