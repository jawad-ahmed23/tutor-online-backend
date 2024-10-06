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
  @Get('/homeworks')
  async getStudentsHomeWork(@Uid() uid: string, @Response() res: Res) {
    return this.attendanceService.getStudentsHomeWork(uid, res);
  }

  @Roles(Role.STUDENT)
  @UseGuards(RolesGuard)
  @Get('/homework')
  async getSingleStudentHomeWork(@Uid() uid: string, @Response() res: Res) {
    return this.attendanceService.getSingleStudentHomeWork(uid, res);
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Get('/assessments')
  async getStudentsAssessment(@Uid() uid: string, @Response() res: Res) {
    return this.attendanceService.getStudentsAssessment(uid, res);
  }

  @Roles(Role.STUDENT)
  @UseGuards(RolesGuard)
  @Get('/assessment')
  async getSingleStudentAssessment(@Uid() uid: string, @Response() res: Res) {
    return this.attendanceService.getSingleStudentAssessment(uid, res);
  }
}
