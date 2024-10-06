import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AssessmentDocument = HydratedDocument<Assessment>;

@Schema({ timestamps: true })
export class Assessment {
  @Prop({ required: true })
  dateTime: Date;

  @Prop({})
  score: number;

  @Prop({ type: String })
  grade: string;

  @Prop({ type: String })
  subject: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assessmentBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student' })
  student: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  parent: Types.ObjectId;
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);
