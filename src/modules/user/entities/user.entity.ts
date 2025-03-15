import { Company } from 'src/modules/company/entities/company.entity';
import { Role } from 'src/modules/auth/entities/role.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Obligation } from 'src/modules/obligations/entities/obligation.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'first_name', type: 'varchar', default: null })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', default: null })
  lastName: string | null;

  @Column({ default: null, type: 'varchar' })
  job: string | null;

  @Column({ default: null, type: 'varchar' })
  password: string | null;

  @Column({
    type: 'boolean',
    default: false,
  })
  active: boolean;

  @ManyToOne(() => Role, { cascade: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'refresh_token', type: 'varchar', default: null })
  refreshToken: string | null;

  @OneToMany(() => Obligation, (obligation) => obligation.createdBy)
  @OneToMany(() => Obligation, (obligation) => obligation.updatedBy)
  obligation: Obligation;

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

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
