import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { EntityService } from './entity.service';
import { Public } from 'src/shared/decorator/public.decorator';
import { Permission } from 'src/shared/decorator/permission.decorator';
import { CreateEntityDto } from './dto/create-entity.dto';
import { User } from 'src/shared/decorator/user.decorator';
import { RequestUserData } from 'src/shared/interface/server.interface';

@Controller({
  path: 'entity',
  version: '1',
})
export class EntityController {
  constructor(private readonly entitiesService: EntityService) {}

  @Public()
  @Get('/type')
  findAll() {
    return this.entitiesService.findAllTypes();
  }

  @Post()
  @Permission('entity:CREATE')
  async create(@Body() input: CreateEntityDto, @User() user: RequestUserData) {
    /**
     * @todo : don't like this ugly-ugly validation
     * move it to custom validator when you have the motivation and knowledge to do it
     */
    const validateError = [];
    const name = await this.entitiesService.isNotUniqueByCompanyId(user.companyId, 'name', input.name);
    const uic = await this.entitiesService.isNotUniqueByCompanyId(user.companyId, 'uic', input.uic);
    const lei = input.lei ? await this.entitiesService.isNotUniqueByCompanyId(user.companyId, 'lei', input.lei) : false;
    const entityTypes = await this.entitiesService.findAllTypes();
    const entityIds = entityTypes.map((entity) => entity.id);
    if (name) {
      validateError.push('Name already exist in this context');
    }
    if (uic) {
      validateError.push('uic already exists in this context');
    }
    if (lei) {
      validateError.push('lei already exists in this context');
    }
    if (!entityIds.includes(input.entityTypeId)) {
      validateError.push('entity type id does not exist');
    }
    if (validateError.length) {
      throw new BadRequestException(validateError);
    }

    return this.entitiesService.create(input, user.companyId);
  }

  @Get('/me')
  @Permission('entity:READ')
  async getComapnyEntities(@User() user: RequestUserData) {
    return this.entitiesService.findAllCompanyEntities(user.companyId);
  }
}
