import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletAssetType } from './entities/wallet-asset-type.entity';
import { WalletAssetTypeService } from './wallet-asset-type.service';
import { EntityModule } from '../entity/entity.module';
import { WalletRules } from './entities/wallet-rules.entity';
import { WalletRulesService } from './wallet-rules.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletAssetType, WalletRules]), EntityModule],
  controllers: [WalletController],
  providers: [WalletService, WalletAssetTypeService, WalletRulesService],
})
export class WalletModule {}
