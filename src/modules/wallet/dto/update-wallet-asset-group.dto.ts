import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletAssetGroupDto } from './create-wallet-asset-group.dto';

export class UpdateWalletAssetGroupDto extends PartialType(CreateWalletAssetGroupDto) {}
