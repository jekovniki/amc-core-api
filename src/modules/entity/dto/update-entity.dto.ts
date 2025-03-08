import { PartialType } from '@nestjs/mapped-types';
import { CreateEntityDto } from './create-entity.dto';
import { EntityStatusType } from './entity.enum';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEntityDto extends PartialType(CreateEntityDto) {
  @IsOptional()
  @IsString()
  status: EntityStatusType;
}
