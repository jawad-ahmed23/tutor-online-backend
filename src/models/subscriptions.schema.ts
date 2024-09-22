import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PriceDocument = HydratedDocument<Price>;

@Schema({ timestamps: true })
export class Price {
  @Prop({ type: String, unique: true })
  plan: string;

  @Prop({ type: String })
  price: string;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: String })
  recurring: string;

  @Prop({ type: Boolean })
  isActive: boolean;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
