import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWalletAssetGroupDto {
  @IsNotEmpty()
  @IsNumber()
  group: number;

  @IsNotEmpty()
  @IsString()
  code: string;
}
