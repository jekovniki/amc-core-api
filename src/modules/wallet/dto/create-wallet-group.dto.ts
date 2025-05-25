import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWalletGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
