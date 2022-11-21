import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  NotFoundException,
  Param,
  Headers,
  UnauthorizedException
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from './dto';
import { HttpService } from '@nestjs/axios';
const Web3 = require("web3")

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService, private httpService: HttpService) {
  }
  auth = "666777888999"

  @Get('/:clientId')
  public async getCustomer(@Headers('auth') headers, @Res() res, @Param('clientId') clientId: string) {
    const web3Provider = new Web3.providers.HttpProvider(
      "https://goerli.infura.io/v3/9f22cd893d9e4acaa44121707f895a87"
    )
    const web3 = new Web3(web3Provider)

    const balanceOfABI = [
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "balance",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
    ];

    const tokenContract = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"

    const user = await this.customersService.findOne(clientId)

    const walletAddress = user.address

    const contract = new web3.eth.Contract(balanceOfABI, tokenContract)

    async function getTokenBalance(walletAddress) {
      const result = await contract.methods.balanceOf(walletAddress).call();
      const formattedResult = web3.utils.fromWei(result, "ether");
      return formattedResult;
    }

    if (!clientId) {
      throw new NotFoundException('User ID does not exist');
    }

    if (headers !== this.auth) {
      throw new UnauthorizedException('Unauthorized');
    }

    const balance = await getTokenBalance(walletAddress)

    let data = {
      address: user.address,
      balance: balance
    }

    return res.status(HttpStatus.OK).json(data);
  }

  @Post()
  public async addWallet(
    @Res() res,
    @Body() createCustomerDto: CreateCustomerDto,
    @Headers('auth') headers
  ) {
    const web3Provider = new Web3.providers.HttpProvider(
      "https://goerli.infura.io/v3/9f22cd893d9e4acaa44121707f895a87"
    )

    const web3 = new Web3(web3Provider)

    const wallet = web3.eth.accounts.create();

    const { address, privateKey } = wallet

    let data = {
      clientId: createCustomerDto.clientId,
      address: address,
      privateKey: privateKey,
    }

    try {

      if (headers !== this.auth) {
        throw new UnauthorizedException('Unauthorized');
      }

      const user = this.customersService.create(data);

      const infoSend = await this.httpService.axiosRef.get(`http://localhost:5000/send-back/${data.clientId}/${data.address}/${data.privateKey}`)

      console.log(infoSend)

      return res.status(HttpStatus.OK).json({
        message: 'Wallet was created',
        status: 200,
        user
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Wallet not created',
        status: 400,
        err
      });
    }
  }
}
