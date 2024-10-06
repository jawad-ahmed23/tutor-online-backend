// src/messages/messages.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { Message, MessageSchema } from '../../models/message.schema';
import { User, UserSchema } from '../../models/user.schema';
import { Students, StudentsSchema } from '../../models/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
      { name: Students.name, schema: StudentsSchema },
    ]),
  ],
  providers: [ChatsService, ChatsGateway],
})
export class ChatsModule {}
