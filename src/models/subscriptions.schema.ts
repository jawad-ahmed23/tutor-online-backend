import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: String })
  userId: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: String })
  currency: string;

  @Prop({ type: String })
  subscriptionId: string;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: String }) // pending | active | incomplete
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Students' })
  student: Types.ObjectId;

  @Prop({ type: String })
  priceId: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
