import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityType } from './entities/entity-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EntityService {
  constructor(
    @InjectRepository(EntityType)
    private readonly entitiesRepository: Repository<EntityType>,
  ) {}
  findAll() {
    return this.entitiesRepository.find();
  }
}
