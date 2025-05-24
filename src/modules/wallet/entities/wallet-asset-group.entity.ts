import { Entity as TypeOrmEntity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { WalletGroup } from './wallet-group.entity';
import { Wallet } from './wallet.entity';

@TypeOrmEntity('wallet_asset_group')
export class WalletAssetGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WalletGroup, (group) => group.walletAssetGroup)
  @JoinColumn({ name: 'wallet_group_id' })
  group: WalletGroup;

  @ManyToOne(() => Wallet, (wallet) => wallet.code)
  @JoinColumn({ name: 'wallet_asset_code' })
  asset: Wallet;
}
