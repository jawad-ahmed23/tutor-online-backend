import {
  Controller,
  Get,
  Post,
  Body,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Response as Res } from 'express';

import { SessionsService } from './sessions.service';
import { AddSessionsDto } from './dto/index.dto';

import { RolesGuard } from '../../../guard/roles.guard';
import { Roles } from '../../../decorator/role.decorator';
import { Role } from '../../../constants';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly userService: SessionsService) {}

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Get('/get-sessions')
  async getSessions(@Response() res: Res) {
    return this.userService.getSessions(res);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('/add-sessions')
  async addSessions(
    @Body() addSessionsDto: AddSessionsDto,
    @Response() res: Res,
  ) {
    return this.userService.addSessions(addSessionsDto, res);
  }
}
