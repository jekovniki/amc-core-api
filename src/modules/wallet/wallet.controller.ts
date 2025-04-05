import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletAssetDto } from './dto/create-wallet-asset.dto';
import { WalletAssetTypeService } from './wallet-asset-type.service';
import { User } from 'src/shared/decorator/user.decorator';
import { RequestUserData } from 'src/shared/interface/server.interface';
import { Permission } from 'src/shared/decorator/permission.decorator';
import { CreateWalletAssetTypeDto } from './dto/create-wallet-asset-type.dto';
import { UpdateWalletAssetTypeDto } from './dto/update-wallet-asset-type.dto';
import { isEnum, isNumberString } from 'class-validator';
import { AssetQueryParamFilter, WalletStructureFilter } from './dto/wallet.enum';
import { AssetQueryParams } from './dto/wallet.type';
import { UpdateWalletAssetDto } from './dto/update-wallet-asset.dto';
import { Entities } from 'src/shared/decorator/entity.decorator';
import { ENTITY_LOCATION } from 'src/shared/interface/entity.enum';
import {
  InvalidAmountException,
  InvalidAssetIdException,
  InvalidAssetQueryParamsException,
  InvalidWalletFilterException,
  MissingQueryParamsException,
} from './exceptions/wallet.exceptions';

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
      throw new InvalidAssetIdException();
    }

    return this.walletAssetTypeService.update(+assetId, input, user.companyId);
  }

  @Delete('/asset-type/:assetId')
  @Permission('entity:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAssetType(@Param('assetId') assetId: string, @User() user: RequestUserData) {
    if (!isNumberString(assetId)) {
      throw new InvalidAssetIdException();
    }

    return this.walletAssetTypeService.remove(+assetId, user.companyId);
  }

  @Post('/:entityId/asset')
  @Permission('entity:CREATE')
  @Entities(ENTITY_LOCATION.PARAM)
  create(@Param('entityId') entityId: string, @Body() createWalletDto: CreateWalletAssetDto, @User() { companyId }: RequestUserData) {
    return this.walletService.createWithStreaming(createWalletDto, { entityId, companyId });
  }

  @Get('/:entityId/structure/:filter')
  @Permission('entity:READ')
  @Entities(ENTITY_LOCATION.PARAM)
  getStructure(@Param('entityId') entityId: string, @Param('filter') filter: string, @User() { companyId }: RequestUserData) {
    if (!filter || !isEnum(filter, WalletStructureFilter)) {
      throw new InvalidWalletFilterException();
    }
    return this.walletService.getWalletStructure(filter as WalletStructureFilter, {
      entityId,
      companyId,
    });
  }

  @Get('/:entityId/asset')
  @Permission('entity:READ')
  @Entities(ENTITY_LOCATION.PARAM)
  getAsset(@Param('entityId') entityId: string, @Query() queryParams: AssetQueryParams, @User() { companyId }: RequestUserData) {
    if (!queryParams) {
      throw new MissingQueryParamsException();
    }

    if (!queryParams.selectBy || !isEnum(queryParams.selectBy, AssetQueryParamFilter)) {
      throw new InvalidAssetQueryParamsException();
    }

    return this.walletService.getAsset(queryParams.value, queryParams.selectBy, {
      entityId,
      companyId,
    });
  }

  @Patch('/:entityId/asset/:selectBy/:selectValue')
  @Permission('entity:UPDATE')
  @Entities(ENTITY_LOCATION.PARAM)
  updateAsset(
    @Param('entityId') entityId: string,
    @Param('selectBy') selectBy: AssetQueryParamFilter,
    @Param('selectValue') selectValue: string,
    @Body() input: UpdateWalletAssetDto,
    @User() { companyId }: RequestUserData,
  ) {
    if (!isEnum(selectBy, AssetQueryParamFilter)) {
      throw new InvalidAssetQueryParamsException();
    }

    return this.walletService.updateAsset(selectValue, selectBy, input, { entityId, companyId });
  }

  @Delete('/:entityId/asset/:selectBy/:selectValue/:amount')
  @Permission('entity:UPDATE')
  @Entities(ENTITY_LOCATION.PARAM)
  deleteAsset(
    @Param('entityId') entityId: string,
    @Param('selectBy') selectBy: AssetQueryParamFilter,
    @Param('selectValue') selectValue: string,
    @Param('amount') amount: string,
    @User() { companyId }: RequestUserData,
  ) {
    if (!isEnum(selectBy, AssetQueryParamFilter)) {
      throw new InvalidAssetQueryParamsException();
    }
    if (!isNumberString(amount)) {
      throw new InvalidAmountException();
    }

    return this.walletService.deleteAsset(selectValue, selectBy, Number(amount), { entityId, companyId });
  }
}
