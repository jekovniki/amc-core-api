import { Entity as TypeOrmEntity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Column } from 'typeorm';
import { WalletGroup } from './wallet-group.entity';
import { Entity } from 'src/modules/entity/entities/entity.entity';

@TypeOrmEntity('wallet_asset_group')
export class WalletAssetGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WalletGroup, (group) => group.walletAssetGroup)
  @JoinColumn({ name: 'wallet_group_id' })
  group: WalletGroup;

  @Column({ name: 'wallet_asset_code' })
  assetCode: string;

  @ManyToOne(() => Entity, (entity) => entity.walletGroup)
  @JoinColumn({ name: 'entity_id' })
  entity: Entity;
}
