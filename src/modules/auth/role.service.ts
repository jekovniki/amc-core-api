import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  public findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  public findById(id: number): Promise<Role | null> {
    return this.rolesRepository.findOneBy({ id });
  }
}
