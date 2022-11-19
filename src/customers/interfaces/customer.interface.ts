import { Document } from 'mongoose';

export interface ICustomer extends Document {
  readonly privateKey: string;
  readonly clientId: string;
  readonly address: string;
  readonly balance: string;
}
