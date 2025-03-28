import {
  Controller,
  Post,
  Body,
  Param,
  BadRequestException,
  Get,
  Query,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { ObligationsService } from './obligations.service';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { RequestUserData } from 'src/shared/interface/server.interface';
import { User } from 'src/shared/decorator/user.decorator';
import { Permission } from 'src/shared/decorator/permission.decorator';
import { EntityService } from '../entity/entity.service';
import { UpdateObligationDto } from './dto/update-obligation.dto';

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
  async create(@Param('entityId') entityId: string, @Body() createObligationDto: CreateObligationDto, @User() user: RequestUserData) {
    const allEntities = await this.entityService.findAllCompanyEntities(user.companyId);

    const isCompanyEntity = allEntities.some((entity) => entity.id === entityId);
    if (!isCompanyEntity) {
      throw new BadRequestException('Please enter valid company entity');
    }
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
        throw new ForbiddenException(`You don't have access to this entity`);
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
