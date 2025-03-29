import { Company } from 'src/modules/company/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity as TypeOrmEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Entity as CompanyEntity } from 'src/modules/entity/entities/entity.entity';
import { Currency } from '../dto/wallet.enum';
import { WalletAssetType } from './wallet-asset-type.entity';

type CurrencyTypes = Currency.BGN | Currency.EUR | Currency.USD;
@TypeOrmEntity('wallet')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  isin: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  value: number;

  @Column({
    type: 'enum',
    enum: [Currency.BGN, Currency.EUR, Currency.USD],
    default: Currency.BGN,
  })
  currency: CurrencyTypes;

  @ManyToOne(() => WalletAssetType, (assetType) => assetType.wallets)
  @JoinColumn({ name: 'asset_type_id' })
  assetType: WalletAssetType;

  @ManyToOne(() => Company, (company) => company.wallet)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => CompanyEntity, (companyEntity) => companyEntity.wallet)
  @JoinColumn({ name: 'entity_id' })
  entity: CompanyEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;
}
