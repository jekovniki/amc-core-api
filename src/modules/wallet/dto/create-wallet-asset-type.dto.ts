import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWalletAssetTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
