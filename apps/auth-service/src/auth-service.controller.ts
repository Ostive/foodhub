import { Body, Controller, Get, Post, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';
import { LogoutDto } from './dto/logout-auth.dto';
import { AuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'User login' })
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns JWT token and user info',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 1,
                    email: 'user@example.com',
                    name: 'John Doe'
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ 
        status: 200, 
        description: 'Returns user profile information',
        schema: {
            example: {
                message: 'This route is protected',
                user: {
                    id: 1,
                    email: 'user@example.com',
                    name: 'John Doe'
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or expired token' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get('profile')
    async profile(@Request() req) {
        return {
            message: 'This route is protected',
            user: req.user
        };
    }

    @ApiOperation({ summary: 'Register new user' })
    @ApiBody({ type: RegisterUserDto })
    @ApiResponse({ 
        status: 201, 
        description: 'User successfully registered',
        schema: {
            example: {
                id: 1,
                email: 'user@example.com',
                name: 'John Doe'
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid data or email already exists' })
    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @ApiOperation({ summary: 'User logout' })
    @ApiBody({ type: LogoutDto })
    @ApiResponse({ status: 200, description: 'Successfully logged out' })
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Body() logoutDto: LogoutDto) {
        return this.authService.logout(logoutDto.token);
    }
    
}
