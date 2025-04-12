import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      username: createUserDto.username.toLowerCase(),
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const user = new this.userModel({
      ...createUserDto,
      username: createUserDto.username.toLowerCase(),
    });

    return user.save();
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({
      username: username.toLowerCase(),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async incrementMessageCount(username: string): Promise<void> {
    const user = await this.userModel.findOne({
      username: username.toLowerCase(),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.messageCount += 1;
    await user.save();
  }

  async checkUsernameAvailability(
    username: string,
  ): Promise<{ available: boolean }> {
    const existingUser = await this.userModel.findOne({
      username: username.toLowerCase(),
    });

    return { available: !existingUser };
  }
}
