import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { Currency } from './wallet.enum';

export class CreateWalletAssetDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  isin: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;

  @IsNotEmpty()
  @IsEnum(Currency, { each: true })
  currency: Currency;

  @IsNumber()
  @IsPositive()
  assetTypeId: number;

  @IsNumber()
  @IsPositive()
  amount: number;
}
