import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AuthGuard } from '../guards/jwt-auth.guard';

@Controller('customer')
@UseGuards(AuthGuard, RolesGuard)
export class CustomerController {
  @Get()
  @Roles('customer', 'admin')
  getCustomerDashboard() {
    return { message: 'Welcome to the customer dashboard!' };
  }

  @Get('profile')
  @Roles('customer', 'admin')
  getCustomerProfile(@Request() req) {
    return { 
      message: 'Customer profile', 
      user: req.user
    };
  }
}
