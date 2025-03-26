import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletAssetType } from './entities/wallet-asset-type.entity';
import { WalletAssetTypeService } from './wallet-asset-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletAssetType])],
  controllers: [WalletController],
  providers: [WalletService, WalletAssetTypeService],
})
export class WalletModule {}
