import { Controller, Post, Body, Param, Get, Query, Patch, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ObligationsService } from './obligations.service';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { RequestUserData } from 'src/shared/interface/server.interface';
import { User } from 'src/shared/decorator/user.decorator';
import { Permission } from 'src/shared/decorator/permission.decorator';
import { EntityService } from '../entity/entity.service';
import { UpdateObligationDto } from './dto/update-obligation.dto';
import { Entities } from 'src/shared/decorator/entity.decorator';
import { ENTITY_LOCATION } from 'src/shared/interface/entity.enum';
import { NoEntityAccessException } from './exceptions/obligations.exceptions';

interface GetObligationQueryParams {
  id?: string;
  entityId?: string;
  status?: string;
}

@Controller({
  path: 'obligation',
  version: '1',
})
export class ObligationsController {
  constructor(
    private readonly obligationsService: ObligationsService,
    private readonly entityService: EntityService,
  ) {}

  @Post('/:entityId')
  @Permission('obligation:CREATE')
  @Entities(ENTITY_LOCATION.PARAM)
  async create(@Param('entityId') entityId: string, @Body() createObligationDto: CreateObligationDto, @User() user: RequestUserData) {
    return this.obligationsService.create(createObligationDto, entityId, user);
  }

  // @todo : implement proper pagination
  @Get()
  @Permission('obligation:READ')
  findOne(@User() user: RequestUserData, @Query() queryParams: GetObligationQueryParams) {
    if (queryParams?.id) {
      return this.obligationsService.findOne(queryParams?.id, 'id');
    }
    if (queryParams?.status) {
      return this.obligationsService.findOne(queryParams?.status, 'status');
    }
    if (queryParams?.entityId) {
      return this.obligationsService?.findOne(queryParams?.entityId, 'entityId');
    }
    return this.obligationsService.findOne(user.companyId, 'companyId');
  }

  @Patch(':id')
  @Permission('obligation:UPDATE')
  async update(@Param('id') id: string, @Body() updateObligationDto: UpdateObligationDto, @User() user: RequestUserData) {
    if (updateObligationDto?.newEntityId) {
      const companyEntities = await this.entityService.findAllCompanyEntities(user.companyId);
      const isCompanyEntity = companyEntities.some((entity) => entity.id === updateObligationDto.newEntityId);
      if (!isCompanyEntity) {
        throw new NoEntityAccessException();
      }
    }
    return this.obligationsService.update(id, updateObligationDto, user.companyId);
  }

  @Delete(':id')
  @Permission('obligation:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.obligationsService.remove(id);
    return;
  }
}
