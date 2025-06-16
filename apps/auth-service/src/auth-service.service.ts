import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersHttpService } from './users/users-http.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersHttpService,
        private jwtService: JwtService,
    ) {}

    async login(loginUserDto: LoginUserDto) {
        try {
            // Find user by email
            const user = await this.usersService.findByEmail(loginUserDto.email);
            
            // Verify password
            const isPasswordValid = await bcrypt.compare(
                loginUserDto.password,
                user.password
            );
            
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }
            
            // Generate JWT token
            const payload: JwtPayload = { 
                sub: user.id, 
                email: user.email,
                role: user.role
            };
            const token = this.jwtService.sign(payload);
            
            // Return token and user info (without password)
            const { password, ...userWithoutPassword } = user;
            return {
                access_token: token,
                user: userWithoutPassword,
                message: 'Login successful'
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async validateUser(payload: JwtPayload) {
        return this.usersService.findById(payload.sub);
    }

    async getProfile(userId: number) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async register(createUserDto: any) {
        return this.usersService.create(createUserDto);
    }
    

}
