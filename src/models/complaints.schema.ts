import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Status } from '../constants';

export type ComplaintsDocument = HydratedDocument<Complaints>;

@Schema({ timestamps: true })
export class Complaints {
  @Prop({ required: true, unique: true })
  complaintId: string;

  @Prop({
    enum: {
      values: [Status.PENDING, Status.RESOLVED],
      message: 'Invalid status type',
      default: 'pending',
    },
  })
  status: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  complaintBy: string;
}

export const ComplaintsSchema = SchemaFactory.createForClass(Complaints);
