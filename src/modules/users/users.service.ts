import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UserStatsDto } from './dto/user-stats.dto';
import { Role } from '../auth/enums/roles.enum';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({
      $or: [
        ...(createUserDto.email
          ? [{ email: createUserDto.email.toLowerCase() }]
          : []),
        { username: createUserDto.username.toLowerCase() },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        existingUser.email === createUserDto.email?.toLowerCase()
          ? 'Email already exists'
          : 'Username already exists',
      );
    }

    const user = new this.userModel({
      ...createUserDto,
      email: createUserDto.email?.toLowerCase(),
      username: createUserDto.username.toLowerCase(),
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({
        email: email.toLowerCase(),
      })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({
        username: username.toLowerCase(),
      })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateEmail(userId: string, email: string): Promise<UserDocument> {
    // Check if email is already in use
    const existingUser = await this.userModel
      .findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      })
      .exec();

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.email = email.toLowerCase();
    return user.save();
  }

  async incrementMessageCount(username: string): Promise<void> {
    const user = await this.userModel
      .findOne({
        username: username.toLowerCase(),
      })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.messageCount += 1;
    await user.save();
  }

  async checkUsernameAvailability(
    username: string,
  ): Promise<{ available: boolean }> {
    const existingUser = await this.userModel
      .findOne({
        username: username.toLowerCase(),
      })
      .exec();

    return { available: !existingUser };
  }

  async getAllUserStats(): Promise<UserStatsDto[]> {
    const users = await this.userModel
      .find({}, { password: 0 })
      .sort({ createdAt: -1 })
      .exec();

    return users.map((user) => this.mapToUserStats(user));
  }

  async getUserStats(username: string): Promise<UserStatsDto> {
    const user = await this.userModel.findOne({ username }, { password: 0 });

    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }

    return this.mapToUserStats(user);
  }

  async promoteToSuperUser(username: string): Promise<UserStatsDto> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }

    if (!user.roles.includes(Role.SUPER_USER)) {
      user.roles.push(Role.SUPER_USER);
      await user.save();
    }

    return this.mapToUserStats(user);
  }

  async demoteFromSuperUser(username: string): Promise<UserStatsDto> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }

    user.roles = user.roles.filter((role) => role !== Role.SUPER_USER);
    await user.save();

    return this.mapToUserStats(user);
  }

  async findByUsernameAndEmail(getUserDto: GetUserDto): Promise<UserDocument> {
    const query: any = {};

    if (getUserDto.username) {
      query.username = getUserDto.username.toLowerCase();
    }

    if (getUserDto.email) {
      query.email = getUserDto.email.toLowerCase();
    }

    const user = await this.userModel.findOne(query).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private mapToUserStats(user: UserDocument): UserStatsDto {
    return {
      username: user.username,
      roles: user.roles,
      messageCount: user.messageCount,
      lastActive: user.lastActive,
      isOnline: user.isOnline,
      createdAt: user.createdAt,
    };
  }
}
