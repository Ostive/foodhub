import { Body, Controller, Get, Post, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';
import { LogoutDto } from './dto/logout-auth.dto';
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

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Body() logoutDto: LogoutDto) {
        return this.authService.logout(logoutDto.token);
    }
    
}
