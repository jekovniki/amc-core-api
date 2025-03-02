import { Controller, Get } from '@nestjs/common';
import { EntityService } from './entity.service';
import { Public } from 'src/shared/decorator/public.decorator';

@Controller({
  path: 'entity',
  version: '1',
})
export class EntityController {
  constructor(private readonly entitiesService: EntityService) {}

  @Public()
  @Get()
  findAll() {
    return this.entitiesService.findAll();
  }
}
