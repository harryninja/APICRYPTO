import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
} from 'class-validator';

export class CreateCustomerDto {

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly privateKey: string;

  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
