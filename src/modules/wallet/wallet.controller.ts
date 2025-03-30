import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletAssetTypeService } from './wallet-asset-type.service';
import { User } from 'src/shared/decorator/user.decorator';
import { RequestUserData } from 'src/shared/interface/server.interface';
import { Permission } from 'src/shared/decorator/permission.decorator';
import { CreateWalletAssetTypeDto } from './dto/create-wallet-asset-type.dto';
import { UpdateWalletAssetTypeDto } from './dto/update-wallet-asset-type.dto';
import { isEnum, isNumberString, isUUID } from 'class-validator';
import { AssetQueryParamFilter, WalletStructureFilter } from './dto/wallet.enum';
import { AssetQueryParams } from './dto/wallet.type';

@Controller({
  path: 'wallet',
  version: '1',
})
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly walletAssetTypeService: WalletAssetTypeService,
  ) {}

  @Get('/asset-type')
  @Permission('entity:READ')
  async getAssetTypes(@User() user: RequestUserData) {
    return this.walletAssetTypeService.findAll(user.companyId);
  }

  @Post('/asset-type/')
  @Permission('entity:CREATE')
  async addAssetType(@Body() input: CreateWalletAssetTypeDto, @User() user: RequestUserData) {
    return this.walletAssetTypeService.create(input, user.companyId);
  }

  @Patch('/asset-type/:assetId')
  @Permission('entity:UPDATE')
  async setAssetType(@Param('assetId') assetId: string, @Body() input: UpdateWalletAssetTypeDto, @User() user: RequestUserData) {
    if (!isNumberString(assetId)) {
      throw new BadRequestException('Provide a valid id');
    }

    return this.walletAssetTypeService.update(+assetId, input, user.companyId);
  }

  @Delete('/asset-type/:assetId')
  @Permission('entity:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAssetType(@Param('assetId') assetId: string, @User() user: RequestUserData) {
    if (!isNumberString(assetId)) {
      throw new BadRequestException('Provide a valid id');
    }

    return this.walletAssetTypeService.remove(+assetId, user.companyId);
  }

  @Post('/:entityId')
  @Permission('entity:CREATE')
  create(@Param('entityId') entityId: string, @Body() createWalletDto: CreateWalletDto, @User() user: RequestUserData) {
    if (!entityId || !isUUID(entityId)) {
      throw new BadRequestException('Please enter valid entity id');
    }
    return this.walletService.createWithStreaming(createWalletDto, entityId, user.companyId);
  }

  @Get('/:entityId/:filter')
  @Permission('entity:READ')
  getStructure(@Param('entityId') entityId: string, @Param('filter') filter: string, @User() user: RequestUserData) {
    if (!entityId || !isUUID(entityId)) {
      throw new BadRequestException('Please enter valid entity id');
    }
    if (!filter || !isEnum(filter, WalletStructureFilter)) {
      throw new BadRequestException('Please enter valid filter');
    }
    return this.walletService.getWalletStructure(filter as WalletStructureFilter, entityId, user.companyId);
  }

  @Get('/asset/')
  @Permission('entity:READ')
  getAsset(@Query() queryParams: AssetQueryParams, @User() user: RequestUserData) {
    if (!queryParams) {
      throw new BadRequestException('Please provide query params');
    }

    if (!queryParams.entityId || !isUUID(queryParams.entityId)) {
      throw new BadRequestException('Please enter valid entity id');
    }

    if (!queryParams.selectBy || !isEnum(queryParams.selectBy, AssetQueryParamFilter)) {
      throw new BadRequestException('Invalid query params');
    }

    return this.walletService.getAsset(queryParams.value, queryParams.selectBy, queryParams.entityId, user.companyId);
  }

  @Patch('/asset/:selectBy/:code')
  @Permission('entity:UPDATE')
  updateAsset(@Param('selectBy') selectBy: AssetQueryParamFilter, @Param('code') code: string, @User() user: RequestUserData) {
    if (!isEnum(selectBy, AssetQueryParamFilter)) {
      throw new BadRequestException('Please provide a valid select by');
    }
  }
}
