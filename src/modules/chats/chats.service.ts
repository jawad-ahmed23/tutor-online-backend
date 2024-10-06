// src/messages/messages.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from '../../models/message.schema';
import { User } from '../../models/user.schema';
import { Students } from '../../models/student.schema';
import { Role } from '../../constants';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Students.name) private studentsModel: Model<Students>,
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
    let user;
    if (Role.STUDENT === senderRole) {
      user = await this.studentsModel.findOne({ _id: senderId });
    } else {
      user = await this.userModel.findOne({ _id: senderId });
    }
    const newMessage = new this.messageModel({
      groupId,
      senderId,
      senderRole,
      username: user.name,
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
