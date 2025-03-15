import { Role } from './role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

type PermissionType = 'READ' | 'CREATE' | 'UPDATE' | 'DELETE';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  feature: string;

  @Column({
    type: 'enum',
    enum: ['READ', 'CREATE', 'DELETE', 'UPDATE'],
  })
  permission: PermissionType;

  @ManyToMany(() => Role)
  roles: Role[];

  constructor(permission: Partial<Permission>) {
    Object.assign(this, permission);
  }
}
