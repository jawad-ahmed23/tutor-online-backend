import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/user.schema';
import { Students, StudentsSchema } from '../../models/student.schema';
import { Complaints, ComplaintsSchema } from '../../models/complaints.schema';
import { Group, GroupSchema } from '../../models/group.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PaymentService } from '../payment/payment.service';
import { Price, PriceSchema } from '../../models/price.schema';
import { Product, ProductSchema } from '../../models/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Students.name, schema: StudentsSchema },
      { name: Complaints.name, schema: ComplaintsSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Price.name, schema: PriceSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, PaymentService],
})
export class UserModule {}
