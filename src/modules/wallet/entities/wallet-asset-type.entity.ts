import { Company } from 'src/modules/company/entities/company.entity';
import { Column, Entity as TypeOrmEntity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { Entity as CompanyEntity } from 'src/modules/entity/entities/entity.entity';
import { Wallet } from './wallet.entity';

@TypeOrmEntity('wallet_asset_type')
export class WalletAssetType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Company, (company) => company.walletAssetType)
  @JoinColumn({ name: 'company_id' })
  company: Company | null;

  @ManyToOne(() => CompanyEntity, (companyEntity) => companyEntity.walletAssetType)
  @JoinColumn({ name: 'entity_id' })
  entity: CompanyEntity | null;

  @OneToMany(() => Wallet, (wallet) => wallet.assetType)
  wallets: Wallet[];
}
