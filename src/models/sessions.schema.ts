import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SESSIONS_TYPE } from '../constants';

export type SessionsDocument = HydratedDocument<Sessions>;

@Schema({ timestamps: true })
export class Sessions {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: Date;

  @Prop({
    enum: {
      values: [SESSIONS_TYPE.FREE, SESSIONS_TYPE.PAID],
      message: 'Invalid session type',
    },
  })
  type: string;

  @Prop({ default: false })
  isAssigned: boolean;

  @Prop({ type: String })
  assignedTo: string;
}

export const SessionsSchema = SchemaFactory.createForClass(Sessions);
