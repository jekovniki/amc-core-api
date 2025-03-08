import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityType } from './entities/entity-type.entity';
import { Repository } from 'typeorm';
import { Entity } from './entities/entity.entity';
import { CreateEntityDto } from './dto/create-entity.dto';
import { EntityStatusType } from './dto/entity.enum';

@Injectable()
export class EntityService {
  constructor(
    @InjectRepository(EntityType)
    private readonly entityTypeRepository: Repository<EntityType>,

    @InjectRepository(Entity)
    private readonly entityRepository: Repository<Entity>,
  ) {}

  findAllTypes() {
    return this.entityTypeRepository.find();
  }

  findAllCompanyEntities(companyId: string) {
    return this.entityRepository.findBy({
      company: {
        id: companyId,
      },
    });
  }

  create(input: CreateEntityDto, companyId: string): Promise<Entity> {
    const data = this.entityRepository.create({
      ...input,
      company: {
        id: companyId,
      },
      entityType: {
        id: input.entityTypeId,
      },
      status: EntityStatusType.Active,
    });

    return this.entityRepository.save(data);
  }

  async isNotUniqueByCompanyId(companyId: string, columnName: string, columnValue: string): Promise<boolean> {
    const count = await this.entityRepository.count({
      where: {
        company: {
          id: companyId,
        },
        [columnName]: columnValue,
      },
    });

    return count > 0;
  }
}
