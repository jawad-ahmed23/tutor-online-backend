import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { HOMEWORK_STATUS } from '../constants';

export type HomeworkDocument = HydratedDocument<Homework>;

@Schema({ timestamps: true })
export class Homework {
  @Prop({ required: true })
  title: string;

  @Prop()
  dueDate: Date;

  @Prop()
  submitDate: Date;

  @Prop({ type: String })
  file: string;

  @Prop({
    enum: {
      values: [
        HOMEWORK_STATUS.IN_PROGRESS,
        HOMEWORK_STATUS.NOT_SUBMITTED,
        HOMEWORK_STATUS.PENDING,
        HOMEWORK_STATUS.SUBMITTED,
      ],
      message: 'Invalid status type',
    },
  })
  status: string;

  @Prop()
  subject: string;

  @Prop({ type: Types.ObjectId, ref: 'Student' })
  student: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  parent: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  teacher: Types.ObjectId;
}

export const HomeworkSchema = SchemaFactory.createForClass(Homework);
