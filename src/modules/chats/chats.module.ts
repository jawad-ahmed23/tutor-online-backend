// src/messages/messages.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { Message, MessageSchema } from '../../models/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [ChatsService, ChatsGateway],
})
export class ChatsModule {}
