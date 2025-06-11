import { Body, Controller, Get, Param, Post, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';

@Controller('users')
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @Get('hello')
  getHello(): string {
    return this.userServiceService.getHello();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userServiceService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userServiceService.updateUser(id, updateUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userServiceService.login(loginUserDto);
  }

  @Get()
  findAll() {
    return this.userServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userServiceService.findOne(id);
  }
}
