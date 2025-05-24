import { Entity as TypeOrmEntity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Column } from 'typeorm';
import { WalletGroup } from './wallet-group.entity';

@TypeOrmEntity('wallet_asset_group')
export class WalletAssetGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WalletGroup, (group) => group.walletAssetGroup)
  @JoinColumn({ name: 'wallet_group_id' })
  group: WalletGroup;

  @Column()
  asset_code: string;
}
