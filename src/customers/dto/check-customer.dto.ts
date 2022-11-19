import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';

  export class CheckCustomerDto {
    @IsString()
    @IsNotEmpty()
    clientId: string;

    @IsString()
    address: string;
  }
