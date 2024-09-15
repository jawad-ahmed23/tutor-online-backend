import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  productId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
