import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICustomer } from './interfaces/customer.interface';
import { CreateCustomerDto } from './dto';
import { Customer } from './schemas/customer.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
  ) {}

  public async findOne(customerId: string): Promise<Customer> {
    const customer = await this.customerModel
      .findById({ _id: customerId })
      .exec();

    if (!customer) {
      throw new NotFoundException(`Customer #${customerId} not found`);
    }

    return customer;
  }

  public async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<ICustomer> {
    const newCustomer = await this.customerModel.create(createCustomerDto);
    return newCustomer;
  }
}
