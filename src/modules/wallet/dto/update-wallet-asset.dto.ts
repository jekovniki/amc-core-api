import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Currency } from './wallet.enum';

export class UpdateWalletAssetDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  isin: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  value: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsEnum(Currency, { each: true })
  currency: Currency;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  assetTypeId: number;
}
