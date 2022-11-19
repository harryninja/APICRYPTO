import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Customer extends Document {

  @Prop({ unique: true })
  privateKey: string;

  @Prop({ unique: true })
  clientId: string;

  @Prop({ unique: true })
  address: string;

  @Prop()
  balance: string;

}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
