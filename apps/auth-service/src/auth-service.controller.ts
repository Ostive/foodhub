import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { AuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async profile(@Request() req) {
        return {
            message: 'This route is protected',
            user: req.user
        };
    }

    
}
