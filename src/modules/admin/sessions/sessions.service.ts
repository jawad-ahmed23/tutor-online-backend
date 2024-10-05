import { Injectable, BadRequestException } from '@nestjs/common';
import { Response as Res } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AddSessionsDto } from './dto/index.dto';
import { Sessions } from '../../../models/sessions.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Sessions.name)
    private sessionsModel: Model<Sessions>,
  ) {}

  async getSessions(res: Res) {
    try {
      const sessions = await this.sessionsModel.find({ isAssigned: false });

      return res.json({
        sessions,
        success: true,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async addSessions(body: AddSessionsDto, res: Res) {
    try {
      const { sessions } = body;

      for (const session of sessions) {
        await this.sessionsModel.create({
          date: session.date,
          time: session.time,
          type: session.type,
          isAssigned: session.isAssigned,
        });
      }

      return res.json({
        success: true,
        message: 'sessions added successfully!',
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }
}
