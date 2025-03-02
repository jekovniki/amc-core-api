import { Column, Entity as DBEntity, PrimaryGeneratedColumn } from 'typeorm';

@DBEntity('entity')
export class Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  constructor(permission: Partial<Entity>) {
    Object.assign(this, permission);
  }
}
