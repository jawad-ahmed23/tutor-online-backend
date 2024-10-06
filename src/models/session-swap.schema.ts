import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SessionSwapDocument = HydratedDocument<SessionSwap>;

@Schema({ timestamps: true })
export class SessionSwap {
  // TODO: use object IDs instead of strings

  // @Prop({ type: Types.ObjectId, ref: 'Sessions' })
  // currentSession: Types.ObjectId;

  // @Prop({ type: Types.ObjectId, ref: 'Sessions' })
  // swapSession: Types.ObjectId;

  @Prop({ type: String })
  currentSession: string;

  @Prop({ type: String })
  swapSession: string;

  @Prop({ type: String })
  reason: string;

  @Prop({ type: String })
  requestFor: string; // makeover | session-swap

  @Prop({ type: Types.ObjectId, ref: 'Students' })
  student: Types.ObjectId;

  @Prop({ type: String, default: 'sent' })
  status: string; // sent | approved | not-approved

  @Prop({ type: String })
  requestedBy: string;
}

export const SessionSwapSchema = SchemaFactory.createForClass(SessionSwap);
