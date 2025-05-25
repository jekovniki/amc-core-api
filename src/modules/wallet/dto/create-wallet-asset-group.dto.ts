import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWalletAssetGroupDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
