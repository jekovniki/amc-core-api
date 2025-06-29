import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { WalletRulesType, WalletRulesValueType } from './wallet.enum';

export class CreateWalletRuleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  minLimit: number;

  @IsNumber()
  @Min(0)
  maxLimit: number;

  @IsNotEmpty()
  @IsEnum(WalletRulesType, { each: true })
  type: WalletRulesType;

  @IsNotEmpty()
  @IsEnum(WalletRulesValueType, { each: true })
  typeValue: WalletRulesValueType;
}
