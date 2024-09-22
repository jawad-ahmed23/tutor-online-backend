import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/user.schema';
import { Students, StudentsSchema } from '../../models/student.schema';
import { Complaints, ComplaintsSchema } from '../../models/complaints.schema';
import { Group, GroupSchema } from '../../models/group.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Students.name, schema: StudentsSchema },
      { name: Complaints.name, schema: ComplaintsSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
