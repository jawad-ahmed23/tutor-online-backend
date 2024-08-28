import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role, EMAIL_REGEX } from '../constants';

export type StudentsDocument = HydratedDocument<Students>;

@Schema({ timestamps: true })
export class Students {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({
    required: true,
  })
  @Prop({ required: true })
  password: string;

  @Prop()
  tempPassword: string;

  @Prop()
  dateOfBirth: string;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  groupYear: string;

  @Prop()
  subject: string;

  @Prop()
  daysPerWeek: number;

  @Prop()
  freeSessionDate: [Date];

  @Prop()
  addedBy: string;
}

export const StudentsSchema = SchemaFactory.createForClass(Students);
