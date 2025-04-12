import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { MessagesDocs } from '../../docs/messages.docs';
import { Role } from '../auth/enums/roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
import { Message } from './schemas/message.schema';

@ApiTags('Messages')
@Controller('message')
@UseGuards(ThrottlerGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Version('1')
  @ApiOperation(MessagesDocs.create.operation)
  @ApiResponse(MessagesDocs.create.responses[201])
  @ApiResponse(MessagesDocs.create.responses[400])
  @ApiResponse(MessagesDocs.create.responses[404])
  @ApiResponse(MessagesDocs.create.responses[429])
  async create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return this.messagesService.create(createMessageDto);
  }

  @Get('my')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(MessagesDocs.findMyMessages.operation)
  @ApiResponse({
    ...MessagesDocs.findMyMessages.responses[200],
    type: Message,
    isArray: true,
  })
  @ApiResponse(MessagesDocs.findMyMessages.responses[401])
  async findMyMessages(@Request() req): Promise<Message[]> {
    return this.messagesService.findByRecipient(req.user.username, req.user);
  }

  @Get(':username')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(MessagesDocs.findByRecipient.operation)
  @ApiParam(MessagesDocs.findByRecipient.params.username)
  @ApiResponse({
    ...MessagesDocs.findByRecipient.responses[200],
    type: Message,
    isArray: true,
  })
  @ApiResponse(MessagesDocs.findByRecipient.responses[401])
  @ApiResponse(MessagesDocs.findByRecipient.responses[403])
  async findByRecipient(
    @Param('username') username: string,
    @Request() req,
  ): Promise<Message[]> {
    const isSuperUser = req.user.roles.includes(Role.SUPER_USER);
    const isSameUser =
      req.user.username.toLowerCase() === username.toLowerCase();

    if (!isSuperUser && !isSameUser) {
      throw new ForbiddenException(
        'Insufficient permissions to access these messages',
      );
    }

    return this.messagesService.findByRecipient(username, req.user);
  }

  @Patch(':messageId/read')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(MessagesDocs.markAsRead.operation)
  @ApiParam(MessagesDocs.markAsRead.params.messageId)
  @ApiResponse({
    ...MessagesDocs.markAsRead.responses[200],
    type: Message,
  })
  @ApiResponse(MessagesDocs.markAsRead.responses[401])
  @ApiResponse(MessagesDocs.markAsRead.responses[403])
  @ApiResponse(MessagesDocs.markAsRead.responses[404])
  async markAsRead(
    @Param('messageId') id: string,
    @Request() req,
  ): Promise<Message> {
    return this.messagesService.markAsRead(id, req.user.username);
  }
}
