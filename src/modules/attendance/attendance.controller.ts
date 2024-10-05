import { Controller, Get, Response, UseGuards } from '@nestjs/common';
import { Response as Res } from 'express';
import { AttendanceService } from './attendance.service';
import { RolesGuard } from '../../guard/roles.guard';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '../../constants';
import { Uid } from '../../decorator/uid.decorator';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Get('/get-students-attendance')
  async getStudentsAttendance(@Uid() uid: string, @Response() res: Res) {
    return this.attendanceService.getStudentsAttendance(uid, res);
  }

  @Roles(Role.STUDENT)
  @UseGuards(RolesGuard)
  @Get('/get-student-attendance')
  async getStudentAttendance(@Uid() uid: string, @Response() res: Res) {
    return this.attendanceService.getStudentAttendance(uid, res);
  }
}
