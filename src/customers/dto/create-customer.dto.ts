import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  privateKey: string;

  @IsString()
  @IsOptional()
  balance: string;
}
