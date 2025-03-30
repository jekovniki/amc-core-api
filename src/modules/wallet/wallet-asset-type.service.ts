import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletAssetType } from './entities/wallet-asset-type.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateWalletAssetTypeDto } from './dto/create-wallet-asset-type.dto';
import { UpdateWalletAssetTypeDto } from './dto/update-wallet-asset-type.dto';

@Injectable()
export class WalletAssetTypeService {
  constructor(
    @InjectRepository(WalletAssetType)
    private readonly walletAssetTypeRepository: Repository<WalletAssetType>,
  ) {}

  async create(input: CreateWalletAssetTypeDto, companyId: string) {
    const assetType = this.walletAssetTypeRepository.create({
      ...input,
      company: {
        id: companyId,
      },
    });

    return await this.walletAssetTypeRepository.save(assetType);
  }

  findAll(companyId: string) {
    return this.walletAssetTypeRepository.find({
      where: [
        {
          company: { id: companyId },
        },
        {
          company: IsNull(),
        },
      ],
    });
  }

  async update(id: number, input: UpdateWalletAssetTypeDto, companyId: string) {
    const item = await this.walletAssetTypeRepository.findOne({
      where: {
        id,
      },
      relations: ['company'],
    });
    if (!item) {
      throw new NotFoundException(['Wallet id does not exist']);
    }
    const isNativeAssetType = item.company === null;
    const isCompanyAssetType = item?.company?.id === companyId;
    if (isNativeAssetType || isCompanyAssetType === false) {
      throw new BadRequestException(`You can't edit this asset`);
    }

    return await this.walletAssetTypeRepository.update(id, {
      ...input,
      company: {
        id: companyId,
      },
    });
  }

  async remove(id: number, companyId: string) {
    const item = await this.walletAssetTypeRepository.findOne({
      where: {
        id,
        company: {
          id: companyId,
        },
      },
    });
    if (!item) {
      throw new BadRequestException(`You can't delete this asset`);
    }

    await this.walletAssetTypeRepository.delete({ id });
  }
}
