import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletAssetTypeService } from './wallet-asset-type.service';
import { User } from 'src/shared/decorator/user.decorator';
import { RequestUserData } from 'src/shared/interface/server.interface';
import { Permission } from 'src/shared/decorator/permission.decorator';
import { CreateWalletAssetTypeDto } from './dto/create-wallet-asset-type.dto';
import { UpdateWalletAssetTypeDto } from './dto/update-wallet-asset-type.dto';
import { isNumberString } from 'class-validator';

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
  @Permission('entity:UPDATE')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAssetType(@Param('assetId') assetId: string, @User() user: RequestUserData) {
    if (!isNumberString(assetId)) {
      throw new BadRequestException('Provide a valid id');
    }

    return this.walletAssetTypeService.remove(+assetId, user.companyId);
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
