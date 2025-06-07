import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Currency } from './wallet.enum';

export class CreateWalletAssetDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
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
