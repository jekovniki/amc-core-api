import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletRuleDto } from './create-wallet-rule.dto';

export class UpdateWalletRuleDto extends PartialType(CreateWalletRuleDto) {}
