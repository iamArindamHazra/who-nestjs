import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Query,
  Version,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UserResponse,
  UsernameAvailabilityResponse,
} from './dto/user.response';

@ApiTags('Users')
@Controller('user')
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: UserResponse,
  })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get(':username')
  @Version('1')
  @ApiOperation({ summary: 'Get user by username' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponse,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Check username availability' })
  @ApiQuery({ name: 'username', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Username availability status',
    type: UsernameAvailabilityResponse,
  })
  async checkUsername(
    @Query('username') username: string,
  ): Promise<{ available: boolean }> {
    return this.usersService.checkUsernameAvailability(username);
  }
}
