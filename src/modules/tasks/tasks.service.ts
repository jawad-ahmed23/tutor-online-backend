import { Injectable, BadRequestException } from '@nestjs/common';
import { Response as Res } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Assessment } from '../../models/assessment.schema';
import { Homework } from '../../models/homework.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Assessment.name)
    private assessmentModel: Model<Assessment>,
    @InjectModel(Assessment.name)
    private homeworkModel: Model<Homework>,
  ) {}

  async getStudentsHomeWork(uid: string, res: Res) {
    try {
      const homeworks = await this.homeworkModel
        .find({ parent: uid })
        .populate('student');

      return res.json({
        homeworks,
        success: true,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async getSingleStudentHomeWork(uid: string, res: Res) {
    try {
      const homework = await this.homeworkModel
        .find({ student: uid })
        .populate('student');

      return res.json({
        homework,
        success: true,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async getStudentsAssessment(uid: string, res: Res) {
    try {
      const assessments = await this.assessmentModel
        .find({ parent: uid })
        .populate('student');

      return res.json({
        assessments,
        success: true,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async getSingleStudentAssessment(uid: string, res: Res) {
    try {
      const assessment = await this.assessmentModel
        .find({ student: uid })
        .populate('student');

      return res.json({
        assessment,
        success: true,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }
}
