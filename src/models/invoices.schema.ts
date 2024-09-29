import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PriceDocument = HydratedDocument<Price>;

@Schema({ timestamps: true })
export class Price {
  @Prop({ type: String, unique: true })
  invoiceId: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: String })
  status: string;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
