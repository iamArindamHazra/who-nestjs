import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './schemas/message.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageResponse } from './dto/message.response';

@ApiTags('Messages')
@Controller('message')
@UseGuards(ThrottlerGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({
    status: 201,
    description: 'Message successfully created',
    type: MessageResponse,
  })
  async create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return this.messagesService.create(createMessageDto);
  }

  @Get(':username')
  @Version('1')
  @ApiOperation({ summary: 'Get messages by recipient username' })
  @ApiResponse({
    status: 200,
    description: 'Messages found',
    type: [MessageResponse],
  })
  async findByRecipient(
    @Param('username') username: string,
  ): Promise<Message[]> {
    return this.messagesService.findByRecipient(username);
  }

  @Patch(':id/read')
  @Version('1')
  @ApiOperation({ summary: 'Mark a message as read' })
  @ApiResponse({
    status: 200,
    description: 'Message marked as read',
    type: MessageResponse,
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async markAsRead(@Param('id') id: string): Promise<Message> {
    return this.messagesService.markAsRead(id);
  }
}
