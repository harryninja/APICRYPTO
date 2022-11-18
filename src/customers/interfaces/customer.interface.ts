import { Document } from 'mongoose';

export interface ICustomer extends Document {
  readonly privateKey: string;
  readonly id: string;
  readonly address: string;
}
