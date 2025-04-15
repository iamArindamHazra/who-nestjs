import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from 'src/modules/messages/messages.controller';
import { MessagesService } from 'src/modules/messages/messages.service';
import {
  Message,
  MessageSchema,
} from 'src/modules/messages/schemas/message.schema';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UsersModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
