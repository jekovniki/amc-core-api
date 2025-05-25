import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletGroupDto } from './create-wallet-group.dto';

export class UpdateWalletGroupDto extends PartialType(CreateWalletGroupDto) {}
