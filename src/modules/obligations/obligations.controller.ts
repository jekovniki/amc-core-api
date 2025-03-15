import { Controller, Post, Body, Param, BadRequestException } from '@nestjs/common';
import { ObligationsService } from './obligations.service';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { RequestUserData } from 'src/shared/interface/server.interface';
import { User } from 'src/shared/decorator/user.decorator';
import { Permission } from 'src/shared/decorator/permission.decorator';
import { EntityService } from '../entity/entity.service';

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
      throw new BadRequestException('Please enter valid comapny entity');
    }
    return this.obligationsService.create(createObligationDto, entityId, user);
  }

  //   @Get()
  //   findAll() {
  //     return this.obligationsService.findAll();
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.obligationsService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateObligationDto: UpdateObligationDto) {
  //     return this.obligationsService.update(+id, updateObligationDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.obligationsService.remove(+id);
  //   }
}
