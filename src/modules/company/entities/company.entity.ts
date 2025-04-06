import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Entity as CompanyEntity } from 'src/modules/entity/entities/entity.entity';
import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import { WalletAssetType } from 'src/modules/wallet/entities/wallet-asset-type.entity';
import { WalletRules } from 'src/modules/wallet/entities/wallet-rules.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar' })
  name: string;

  @Column({ unique: true, type: 'varchar' })
  uic: string;

  @Column({ type: 'varchar' })
  logo: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;

  @OneToMany(() => CompanyEntity, (entity) => entity.company)
  entities: CompanyEntity[];

  @OneToMany(() => Wallet, (wallet) => wallet.company)
  wallet: Wallet[];

  @OneToMany(() => WalletAssetType, (wallet) => wallet.company)
  walletAssetType: WalletAssetType[];

  @OneToMany(() => WalletRules, (rules) => rules.company)
  walletRules: WalletRules[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  constructor(company: Partial<Company>) {
    Object.assign(this, company);
  }
}
