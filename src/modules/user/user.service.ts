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
import { AddComplaintDto, AddStudentsDto } from './dto/index.dto';
import { User } from '../../models/user.schema';
import { SALT_ROUNDS, Role } from '../../constants';
import { Students } from '../../models/student.schema';
import { Complaints } from '../../models/complaints.schema';
//import { UserRole, UserStatus } from '../../constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Students.name)
    private studentsModel: Model<Students>,
    @InjectModel(Complaints.name)
    private complaintsModel: Model<Complaints>,
  ) {}

  async getStudents(uid: string, res: Res) {
    try {
      const students = await this.studentsModel.find({ addedBy: uid });

      return res.json({
        message: 'students added successfully!',
        students,
        success: true,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async addStudents(uid: string, body: AddStudentsDto, res: Res) {
    try {
      const { students } = body;

      const _students = [];

      for (const student of students) {
        const username = await this._generateUniqueUsername(student.name);
        const randomId = new ShortUniqueId({ length: 12 });
        const password = randomId.rnd();
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        _students.push({
          ...student,
          username,
          password: hashedPassword,
          tempPassword: password,
          addedBy: uid,
          //  role: Role.STUDENT,
        });

        await this.studentsModel.create({
          ...student,
          username,
          password: hashedPassword,
          tempPassword: password,
          addedBy: uid,
          //  role: Role.STUDENT,
        });
      }

      return res.json({
        message: 'students added successfully!',
        students: _students,
        success: true,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async addComplaint(uid: string, body: AddComplaintDto, res: Res) {
    try {
      const { title, message } = body;
      const complaintId = await this._generateUniqueComplaintId('cm');

      await this.complaintsModel.create({
        id: complaintId,
        title,
        message,
        complaintBy: uid,
      });

      return res.json({
        message: 'complaint created successfully!',
        success: true,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async getComplaints(uid: string, res: Res) {
    try {
      const complaints = await this.complaintsModel.find({ complaintBy: uid });
      return res.json({
        message: 'complaint created successfully!',
        complaints: complaints,
        success: true,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async _generateUniqueUsername(name) {
    let username;
    let isUnique = false;

    while (!isUnique) {
      const code = Math.floor(1000 + Math.random() * 900000).toString();
      username = `${name}_${code}`;
      const existingCode = await this.studentsModel.findOne({
        username: username,
      });
      if (!existingCode) {
        isUnique = true;
      }
    }

    return username;
  }

  async _generateUniqueComplaintId(name) {
    let complaintId;
    let isUnique = false;

    while (!isUnique) {
      const code = Math.floor(1000 + Math.random() * 900000).toString();
      complaintId = `${name}_${code}`;
      const existingCode = await this.complaintsModel.findOne({
        id: complaintId,
      });
      if (!existingCode) {
        isUnique = true;
      }
    }

    return complaintId;
  }
}
