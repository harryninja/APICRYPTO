import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  NotFoundException,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import Web3 from 'web3'

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get('/:id')
  public async getCustomer(@Res() res, @Param('id') id: string) {
    if (!id) {
      throw new NotFoundException('Customer ID does not exist');
    }
    const web3Provider = new Web3.providers.HttpProvider(
      ""
    )
    const web3 = new Web3(web3Provider)

    const wallet = web3.eth.accounts.create();

    return res.status(HttpStatus.OK).json(wallet);
  }

  @Post()
  public async addCustomer(
    @Res() res,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    try {

      const web3Provider = new Web3.providers.HttpProvider(
        ""
      )
      const web3 = new Web3(web3Provider)

      const wallet = web3.eth.accounts.create();
      await this.customersService.create(createCustomerDto);

      return res.status(HttpStatus.OK).json({
        message: 'Wallet was created',
        wallet,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Wallet not created',
        status: 400,
      });
    }
  }
}
