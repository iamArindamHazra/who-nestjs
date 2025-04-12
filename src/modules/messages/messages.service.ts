import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../auth/enums/roles.enum';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    // Verify recipient exists
    await this.usersService.findByUsername(createMessageDto.recipientUsername);

    const message = new this.messageModel(createMessageDto);
    await this.usersService.incrementMessageCount(
      createMessageDto.recipientUsername,
    );

    return message.save();
  }

  async findById(id: string): Promise<Message> {
    const message = await this.messageModel.findById(id).exec();
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async findByRecipient(
    username: string,
    requestingUser: { username: string; roles: Role[] },
  ): Promise<Message[]> {
    // If the requesting user is not the recipient and is not a super user, deny access
    if (username.toLowerCase() !== requestingUser.username.toLowerCase()) {
      // Even if the user is a super user, they can't see other users' messages
      throw new ForbiddenException('You can only view your own messages');
    }

    return this.messageModel
      .find({ recipientUsername: username.toLowerCase() })
      .sort({ createdAt: -1 })
      .exec();
  }

  private async verifyMessageOwnership(
    messageId: string,
    username: string,
  ): Promise<Message> {
    const message = await this.findById(messageId);
    if (message.recipientUsername.toLowerCase() !== username.toLowerCase()) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async markAsRead(messageId: string, username: string): Promise<Message> {
    await this.verifyMessageOwnership(messageId, username);

    const message = await this.messageModel
      .findByIdAndUpdate(messageId, { isRead: true }, { new: true })
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }
}
