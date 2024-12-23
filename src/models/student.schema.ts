import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StudentsDocument = HydratedDocument<Students>;

@Schema({ timestamps: true })
export class Students {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ type: String })
  email?: string;

  @Prop({ type: String })
  customerId?: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop()
  tempPassword: string;

  @Prop()
  dateOfBirth: string;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop({
    type: [
      {
        yearGroup: String,
        subjects: [String],
      },
    ],
  })
  yearGroups: {
    yearGroup: string;
    subjects: string[];
  }[];

  @Prop()
  daysPerWeek: number;

  @Prop({ type: [Types.ObjectId], default: [], ref: 'Sessions' })
  freeSessions: Types.ObjectId[];

  @Prop()
  addedBy: string;

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

  @Prop({ type: String, default: 'inactive' }) // inactive | active
  status: string;

  @Prop({ type: Boolean, default: false })
  isSuperUser: boolean;

  @Prop({ type: Boolean, default: false })
  enableNotifications: boolean;
}

export const StudentsSchema = SchemaFactory.createForClass(Students);
