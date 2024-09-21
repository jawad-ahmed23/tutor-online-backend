import {
  Injectable,
  BadRequestException,
  NotFoundException,
  // InternalServerErrorException,
  // HttpException,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import ShortUniqueId from 'short-unique-id';
import * as bcrypt from 'bcrypt';
import { AddComplaintDto, AddStudentsDto, StudentDto } from './dto/index.dto';
import { User } from '../../models/user.schema';
import { SALT_ROUNDS } from '../../constants';
import { Students } from '../../models/student.schema';
import { Complaints } from '../../models/complaints.schema';
import { PaymentService } from '../payment/payment.service';
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
    private readonly paymentService: PaymentService,
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
      const { students, proceedToPayment, priceId } = body;

      const _students = [];

      const user = await this.userModel.findById(uid);

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
        });

        await this.studentsModel.create({
          ...student,
          username,
          password: hashedPassword,
          tempPassword: password,
          addedBy: uid,
          verified: true,
        });
      }

      let client_secret = null;

      if (proceedToPayment) {
        const res = await this.paymentService.createSetupIntent(
          user.customerId,
        );

        client_secret = res.client_secret;
      }

      return res.json({
        success: true,
        message: 'students added successfully!',
        students: _students,
        client_secret: client_secret,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async addComplaint(uid: string, body: AddComplaintDto, res: Res) {
    try {
      const { title, message } = body;
      const complaintId = await this._generateUniqueComplaintId('CM');

      await this.complaintsModel.create({
        complaintId: complaintId,
        title,
        message,
        complaintBy: uid,
        status: 'pending',
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

  async onBoardSingleStudent(uid: string, body: StudentDto, res: Res) {
    try {
      const isStudentExists = await this.studentsModel.findById(uid);

      if (!isStudentExists) {
        throw new NotFoundException('Student not found!');
      }

      await this.studentsModel.findByIdAndUpdate(uid, {
        dateOfBirth: body.dateOfBirth,
        country: body.country,
        city: body.city,
        subjects: body.subjects,
        daysPerWeek: body.daysPerWeek,
        freeSessionDate: body.freeSessionDate,
      });

      res.status(200).json({
        success: true,
        message: 'Updated Successfully!',
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async _generateUniqueUsername(name: string) {
    let username: string;
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

  async _generateUniqueComplaintId(name: string) {
    let complaintId: string;
    let isUnique = false;

    while (!isUnique) {
      const code = Math.floor(1000 + Math.random() * 900000).toString();
      complaintId = `${name}_${code}`;

      const existingCode = await this.complaintsModel.findOne({
        complaintId: complaintId,
      });

      if (!existingCode) {
        isUnique = true;
      }
    }

    return complaintId;
  }
}
