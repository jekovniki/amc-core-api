import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { EntityController } from './entity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityType } from './entities/entity-type.entity';
import { Entity } from './entities/entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityType, Entity])],
  controllers: [EntityController],
  providers: [EntityService],
  exports: [EntityService],
})
export class EntityModule {}
