import {
  Controller,
  Get,
  Post,
  Body,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { Uid } from '../../decorator/uid.decorator';
import { UserService } from './user.service';
import { AddStudentsDto, AddComplaintDto, StudentDto } from './dto/index.dto';

import { RolesGuard } from '../../guard/roles.guard';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '../../constants';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Get('/get-students')
  async getStudents(@Uid() uid: string, @Response() res: Res) {
    return this.userService.getStudents(uid, res);
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Post('/add-students')
  async addStudents(
    @Uid() uid: string,
    @Body() addStudentsDto: AddStudentsDto,
    @Response() res: Res,
  ) {
    return this.userService.addStudents(uid, addStudentsDto, res);
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Get('/get-complaints')
  async getComplaints(@Uid() uid: string, @Response() res: Res) {
    return this.userService.getComplaints(uid, res);
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Post('/add-complaint')
  async addComplaints(
    @Uid() uid: string,
    @Body() addComplaintDto: AddComplaintDto,
    @Response() res: Res,
  ) {
    return this.userService.addComplaint(uid, addComplaintDto, res);
  }
  @Roles(Role.STUDENT)
  @UseGuards(RolesGuard)
  @Post('/on-board-single-student')
  async onBoardSingleStudent(
    @Uid() uid: string,
    @Body() studentDto: StudentDto,
    @Response() res: Res,
  ) {
    return this.userService.onBoardSingleStudent(uid, studentDto, res);
  }
}
