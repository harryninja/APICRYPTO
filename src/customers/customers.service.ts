import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICustomer } from './interfaces/customer.interface';
import { Customer } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
  ) { }

  public async findOne(clientId: string): Promise<Customer> {
    const customer = await this.customerModel
      .findOne({ where: { clientId: clientId } })
      .exec();

    if (!customer) {
      throw new NotFoundException(`Customer #${clientId} not found`);
    }

    return customer;
  }

  public async findAll(
    clientId: string
  ): Promise<Customer[]> {
    return await this.customerModel
      .find({ where: {clientId: clientId}})
      .exec();
  }

  public async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<ICustomer> {
    try {
      const newCustomer = await this.customerModel.create(createCustomerDto);
      return newCustomer;
    } catch (err) {
      return err
    }
  }

}
