import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role, EMAIL_REGEX } from '../constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({})
  username: string;

  @Prop({
    enum: {
      values: [
        Role.ADMIN,
        Role.CO_ORDINATOR,
        Role.PARENT,
        Role.STUDENT,
        Role.TUTOR,
      ],
      message: 'Invalid role type',
    },
  })
  role: string;

  @Prop({
    validators: {
      validate: function (v: string) {
        return EMAIL_REGEX.test(v);
      },
      message: (props: any) => `${props.value} is not a valid email!`,
    },
    //  required: true,
  })
  email: string;

  @Prop({
    unique: true,
    required: true,
  })
  @Prop({ required: true })
  password: string;

  @Prop()
  tempPassword: string;

  @Prop({ unique: true })
  verificationCode: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({})
  dateOfBirth: string;

  @Prop({})
  country: string;

  @Prop({})
  city: string;

  @Prop({})
  groupYear: string;

  @Prop({})
  subject: string;

  @Prop({})
  daysPerWeek: number;

  @Prop({})
  freeSessionDate: [Date];

  @Prop({})
  addedBy: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
