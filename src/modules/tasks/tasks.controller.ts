import { Controller, Get, Response, UseGuards } from '@nestjs/common';
import { Response as Res } from 'express';
import { TasksService } from './tasks.service';
import { RolesGuard } from '../../guard/roles.guard';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '../../constants';
import { Uid } from '../../decorator/uid.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly attendanceService: TasksService) {}

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Get('/get-students-homework')
  async getStudentsHomeWork(@Uid() uid: string, @Response() res: Res) {
    return this.attendanceService.getStudentsHomeWork(uid, res);
  }

  @Roles(Role.STUDENT)
  @UseGuards(RolesGuard)
  @Get('/get-student-homework')
  async getStudentHomeWork(@Uid() uid: string, @Response() res: Res) {
    return this.attendanceService.getStudentHomeWork(uid, res);
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Get('/get-students-assessment')
  async getStudentsAssessment(@Uid() uid: string, @Response() res: Res) {
    return this.attendanceService.getStudentsAssessment(uid, res);
  }

  @Roles(Role.STUDENT)
  @UseGuards(RolesGuard)
  @Get('/get-student-assessment')
  async getStudentAssessment(@Uid() uid: string, @Response() res: Res) {
    return this.attendanceService.getStudentAssessment(uid, res);
  }
}
