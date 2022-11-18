import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Customer extends Document {

  @Prop({ unique: true })
  privateKey: string;

  @Prop({ unique: true })
  id: string;

  @Prop({ unique: true })
  address: string;

}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
