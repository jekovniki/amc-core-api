import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletAssetTypeService } from './wallet-asset-type.service';
import { User } from 'src/shared/decorator/user.decorator';
import { RequestUserData } from 'src/shared/interface/server.interface';
import { Permission } from 'src/shared/decorator/permission.decorator';
import { CreateWalletAssetTypeDto } from './dto/create-wallet-asset-type.dto';
import { isUUID } from 'class-validator';
import { EntityService } from '../entity/entity.service';

@Controller({
  path: 'wallet',
  version: '1',
})
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly walletAssetTypeService: WalletAssetTypeService,
    private readonly entityService: EntityService,
  ) {}

  @Get('/asset-type')
  @Permission('entity:READ')
  async findAssetTypes(@User() user: RequestUserData) {
    return this.walletAssetTypeService.findAll(user.companyId);
  }

  @Post('/asset-type/:entityId')
  @Permission('entity:CREATE')
  async addAssetType(@Param('entityId') entityId: string, @Body() input: CreateWalletAssetTypeDto, @User() user: RequestUserData) {
    if (!entityId || !isUUID(entityId)) {
      throw new BadRequestException('Please provide a valid entity');
    }
    const companyEntities = await this.entityService.findAllCompanyEntities(user.companyId);
    if (!companyEntities.length || !companyEntities.some((entity) => entity.id === entityId)) {
      throw new BadRequestException('Please provide a valid entity');
    }

    return this.walletAssetTypeService.create(input, entityId, user.companyId);
  }

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.create(createWalletDto);
  }

  @Get()
  findAll() {
    return this.walletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.update(+id, updateWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(+id);
  }
}
