import { Column, Entity as TypeORMEntity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Entity } from './entity.entity';

@TypeORMEntity('entity-type')
export class EntityType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Entity, (entity) => entity.entityType)
  entities: Entity[];

  constructor(permission: Partial<EntityType>) {
    Object.assign(this, permission);
  }
}
