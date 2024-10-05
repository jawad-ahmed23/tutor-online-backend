// src/messages/messages.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from '../../models/message.schema';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async getChatHistory(groupId: Types.ObjectId): Promise<Message[]> {
    return this.messageModel.find({ groupId }).sort({ timestamp: 1 });
  }

  async saveMessage(
    groupId: Types.ObjectId,
    senderId: Types.ObjectId,
    senderRole: string,
    message: string,
  ): Promise<Message> {
    console.log('groupId', groupId);
    console.log('senderId', senderId);
    const newMessage = new this.messageModel({
      groupId,
      senderId,
      senderRole,
      message,
    });
    return newMessage.save();
  }

  async markMessageAsRead(
    messageId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Message> {
    return this.messageModel.findOneAndUpdate(
      messageId,
      { $addToSet: { readBy: userId } },
      { new: true },
    );
  }
}
