import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role, EMAIL_REGEX } from '../constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({
    enum: {
      values: [Role.ADMIN, Role.CO_ORDINATOR, Role.PARENT, Role.TUTOR],
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
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    unique: true,
    required: true,
  })
  @Prop({ required: true })
  password: string;

  @Prop()
  phoneNumber: number;

  @Prop({
    type: {
      code: Number,
      expire: Date,
    },
  })
  verification: {
    code: number;
    expire: Date;
  };

  @Prop({ default: false })
  verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
