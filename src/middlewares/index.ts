import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import config from '../config';

import { User } from '../models/user.schema';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async use(req: any, res: Response, next: any): Promise<any> {
    try {
      const token: any = req.headers['x-a'];

      if (!token) {
        throw new BadRequestException({
          message: 'Please provide a valid token',
        });
      }

      const decoded: any = jwt.verify(token, config().JWT_SECRET);
      console.log(decoded._id, 'decoded');

      const userData = await this.userModel.findOne({
        _id: decoded._id,
      });

      console.log('userData', userData);

      //   let userR0es: any;
      //   const permissions = [];

      const user = {
        uid: decoded._id,
        roles: userData.role,
      };

      req.user = user;
      next();
    } catch (error) {
      console.log('error', error.message);
      throw new UnauthorizedException({
        message: error.response.message || 'User is not authorized!',
        errorCode: 'USER_NOT_AUTHORIZED',
      });
    }
  }
}
