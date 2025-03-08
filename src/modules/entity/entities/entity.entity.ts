import {
  Column,
  CreateDateColumn,
  Entity as TypeORMEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Company } from 'src/modules/company/entities/company.entity';
import { EntityType } from './entity-type.entity';

type StatusType = 'ACTIVE' | 'INACTIVE';

@TypeORMEntity('entity')
export class Entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  uic: string;

  @Column({ type: 'varchar' })
  lei: string;

  @ManyToOne(() => Company, (company) => company.entities)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => EntityType, (entityType) => entityType.entities)
  @JoinColumn({ name: 'entity_type_id' })
  entityType: EntityType;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE'],
  })
  status: StatusType;

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

  constructor(entity: Partial<Entity>) {
    Object.assign(this, entity);
  }
}
