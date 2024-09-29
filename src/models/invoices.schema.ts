import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: String, unique: true })
  invoiceId: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: String })
  currency: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: String })
  userId: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
