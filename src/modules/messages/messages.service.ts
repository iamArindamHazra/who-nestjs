import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UsersService } from '../users/users.service';

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

  async findByRecipient(username: string): Promise<Message[]> {
    return this.messageModel
      .find({ recipientUsername: username.toLowerCase() })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(messageId: string): Promise<Message> {
    return this.messageModel
      .findByIdAndUpdate(messageId, { isRead: true }, { new: true })
      .exec();
  }
}
