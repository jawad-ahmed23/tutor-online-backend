import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PriceDocument = HydratedDocument<Price>;

@Schema({ timestamps: true })
export class Price {
  @Prop({ type: String, unique: true })
  priceId: string;

  @Prop({ type: String })
  currency: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: String })
  productId: string;

  @Prop({ type: Number })
  daysPerWeek: number;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
