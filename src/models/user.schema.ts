import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role, EMAIL_REGEX } from '../constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({
    enum: {
      values: [Role.ADMIN, Role.COORDINATOR, Role.PARENT, Role.TUTOR],
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

  @Prop({ type: String })
  customerId: string;

  @Prop({
    unique: true,
    required: true,
  })
  @Prop({ required: true })
  password: string;

  @Prop({ type: String })
  phoneNumber: string;

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

  @Prop({ type: [Types.ObjectId], default: [], ref: 'Group' })
  groupId: Types.ObjectId[];

  @Prop({ type: Boolean, default: false })
  enableNotifications: boolean;
}

// @Schema({ timestamps: true })
// export class User {
//   @Prop({ required: true })
//   name: string;

//   @Prop({
//     enum: {
//       values: [
//         Role.ADMIN,
//         Role.COORDINATOR,
//         Role.PARENT,
//         Role.TUTOR,
//         Role.STUDENT,
//       ],
//       message: 'Invalid role type',
//     },
//     required: true,
//   })
//   role: string;

//   @Prop({
//     required: function (this: User) {
//       return this.role !== Role.STUDENT; // Email is required for non-students
//     },
//     unique: function (this: User) {
//       return this.role !== Role.STUDENT; // Email should be unique for non-students
//     },
//     validate: {
//       validator: function (v: string) {
//         return this.role === Role.STUDENT || EMAIL_REGEX.test(v); // Validate only for non-students
//       },
//       message: (props: any) => `${props.value} is not a valid email!`,
//     },
//   })
//   email?: string;

//   @Prop({
//     unique: function (this: User) {
//       return this.role !== Role.STUDENT; // Phone should be unique for non-students
//     },
//     required: function (this: User) {
//       return this.role !== Role.STUDENT; // Phone is required for non-students
//     },
//   })
//   phoneNumber?: number;

//   @Prop({
//     required: true,
//   })
//   password: string;

//   @Prop()
//   username?: string; // Username required for students only

//   @Prop()
//   dateOfBirth?: string;

//   @Prop()
//   country?: string;

//   @Prop()
//   city?: string;

//   @Prop()
//   groupYear?: string;

//   @Prop()
//   subjects?: string[];

//   @Prop()
//   daysPerWeek?: number;

//   @Prop()
//   freeSessionDate?: Date[];

//   @Prop()
//   addedBy?: string; // This can be used to track which parent added the student

//   @Prop({
//     type: {
//       code: Number,
//       expire: Date,
//     },
//   })
//   verification?: {
//     code: number;
//     expire: Date;
//   };

//   @Prop({ default: false })
//   verified: boolean;
// }

export const UserSchema = SchemaFactory.createForClass(User);
