import { Entity } from 'src/modules/entity/entities/entity.entity';
import { Column, Entity as TypeOrmEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { WalletAssetGroup } from './wallet-asset-group.entity';

@TypeOrmEntity('wallet_group')
export class WalletGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Entity, (entity) => entity.walletGroup)
  @JoinColumn({ name: 'entity_id' })
  entity: Entity;

  @OneToMany(() => WalletAssetGroup, (assetGroup) => assetGroup.group)
  walletAssetGroup: WalletAssetGroup[];
}
