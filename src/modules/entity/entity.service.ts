import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entity } from './entities/entity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EntityService {
  constructor(
    @InjectRepository(Entity)
    private readonly entitiesRepository: Repository<Entity>,
  ) {}
  findAll() {
    return this.entitiesRepository.find();
  }
}
