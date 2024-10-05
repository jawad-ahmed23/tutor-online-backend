import { Injectable, BadRequestException } from '@nestjs/common';
import { Response as Res } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance } from '../../models/attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<Attendance>,
  ) {}

  async getStudentsAttendance(uid: string, res: Res) {
    try {
      const attendances = await this.attendanceModel
        .find({ parent: uid })
        .populate('attendant');

      return res.json({
        attendances,
        success: true,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async getStudentAttendance(uid: string, res: Res) {
    try {
      const attendance = await this.attendanceModel
        .find({ attendant: uid })
        .populate('attendant');

      return res.json({
        attendance,
        success: true,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }
}
