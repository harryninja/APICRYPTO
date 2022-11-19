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
  Logger,
  UnauthorizedException,
  ConflictException
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CheckCustomerDto, CreateCustomerDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
const Web3 = require("web3")

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {
  }

  auth = "666777888999"



  @Get('/:clientId')
  public async getCustomer(@Headers('auth') headers, @Res() res, @Param('clientId') clientId: string) {

    const web3Provider = new Web3.providers.HttpProvider(
      "https://sepolia.infura.io/v3/f486c42d7656406bb5aba8ae8c068821"
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

    const tokenContract = "0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa"

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
      "https://sepolia.infura.io/v3/f486c42d7656406bb5aba8ae8c068821"
    )

    const web3 = new Web3(web3Provider)

    const wallet = web3.eth.accounts.create();

    const { address, privateKey } = wallet

    const compare = this.customersService.findOne(createCustomerDto.clientId)

    let data = {
      clientId: createCustomerDto.clientId,
      address: address,
      privateKey: privateKey,
      balance: "0"
    }

    try {

      if ((await compare).clientId === data.clientId) {
        throw new ConflictException('This id already has a wallet')
      }

      if (headers !== this.auth) {
        throw new UnauthorizedException('Unauthorized');
      }

      const user = this.customersService.create(data);

      return res.status(HttpStatus.OK).json({
        message: 'Wallet was created',
        status: 200,
        user,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Wallet not created',
        status: 400,
      });
    }
  }

  @Post()
  public async sendBackInfo(
    @Res() res,
    @Body() clientId,
    @Headers('auth') headers
  ) {

    try {

      if (headers !== this.auth) {
        throw new UnauthorizedException('Unauthorized');
      }

    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: Wallet not created',
        status: 400,
      });
    }

  }
}
