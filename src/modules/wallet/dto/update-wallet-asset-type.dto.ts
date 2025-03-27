import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletAssetTypeDto } from './create-wallet-asset-type.dto';

export class UpdateWalletAssetTypeDto extends PartialType(CreateWalletAssetTypeDto) {}
