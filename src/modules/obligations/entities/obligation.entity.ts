import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, UpdateDateColumn } from 'typeorm';
import { Entity as CompanyEntity } from 'src/modules/entity/entities/entity.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { ObligationStatus } from '../dto/obligation.enum';

type ObligationStatusType = ObligationStatus.PENDING | ObligationStatus.RESOLVED | ObligationStatus.DELETED;

@Entity()
export class Obligation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Company, (company) => company.entities)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => CompanyEntity, (companyEntity) => companyEntity.obligation)
  @JoinColumn({ name: 'entity_id' })
  entity: CompanyEntity;

  @Column({
    name: 'due_date_at',
    type: 'timestamptz',
    default: () => `CURRENT_TIMESTAMP + INTERVAL '7 days'`,
  })
  dueDateAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User | null;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'RESOLVED', 'DELETED'],
    default: 'PENDING',
  })
  status: ObligationStatusType;

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
