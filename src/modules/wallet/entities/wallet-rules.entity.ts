import { Company } from 'src/modules/company/entities/company.entity';
import { Entity } from 'src/modules/entity/entities/entity.entity';
import {
  Column,
  Entity as TypeOrmEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WalletRulesType, WalletRulesValueType } from '../dto/wallet.enum';

@TypeOrmEntity('wallet_rules')
export class WalletRules {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Company, (company) => company.walletRules)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Entity, (entity) => entity.rules)
  @JoinColumn({ name: 'entity_id' })
  entity: Entity;

  @Column({ name: 'min_limit', type: 'decimal', precision: 18, scale: 2 })
  minLimit: number;

  @Column({ name: 'max_limit', type: 'decimal', precision: 18, scale: 2 })
  maxLimit: number;

  @Column({
    type: 'enum',
    enum: [WalletRulesType.PerAsset, WalletRulesType.PerGroup, WalletRulesType.All, WalletRulesType.PerTypeAsset],
  })
  type: WalletRulesType;

  @Column({
    type: 'enum',
    name: 'type_value',
    enum: [WalletRulesValueType.Percentage, WalletRulesValueType.BGN, WalletRulesValueType.EUR, WalletRulesValueType.USD],
  })
  typeValue: WalletRulesValueType;

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

  constructor(rules: Partial<WalletRules>) {
    Object.assign(this, rules);
  }
}
