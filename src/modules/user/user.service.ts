import {
  Injectable,
  BadRequestException,
  // InternalServerErrorException,
  // HttpException,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import ShortUniqueId from 'short-unique-id';
import * as bcrypt from 'bcrypt';
import { AddStudentsDto } from './dto/index.dto';
import { User } from '../../models/user.schema';
import { SALT_ROUNDS, Role } from '../../constants';
//import { UserRole, UserStatus } from '../../constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getStudents(uid: string, res: Res) {
    try {
      const students = await this.userModel.find({ addedBy: uid });

      return res.json({ message: 'students added successfully!', students });
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async addStudents(uid: string, body: AddStudentsDto, res: Res) {
    try {
      const { students } = body;

      for (const student of students) {
        const username = await this._generateUniqueUsername(student.name);
        const randomId = new ShortUniqueId({ length: 12 });
        const password = randomId.rnd();
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await this.userModel.create({
          ...student,
          username,
          password: hashedPassword,
          tempPassword: password,
          addedBy: uid,
          role: Role.STUDENT,
        });
      }

      return res.json({ message: 'students added successfully!' });
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async _generateUniqueUsername(name) {
    let username;
    let isUnique = false;

    while (!isUnique) {
      const code = Math.floor(1000 + Math.random() * 900000).toString();
      username = `${name}_${code}`;
      const existingCode = await this.userModel.findOne({
        username: username,
      });
      if (!existingCode) {
        isUnique = true;
      }
    }

    return username;
  }
}
