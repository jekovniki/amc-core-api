import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletAssetType } from './entities/wallet-asset-type.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateWalletAssetTypeDto } from './dto/create-wallet-asset-type.dto';

@Injectable()
export class WalletAssetTypeService {
  constructor(
    @InjectRepository(WalletAssetType)
    private readonly walletAssetTypeRepository: Repository<WalletAssetType>,
  ) {}

  async create(input: CreateWalletAssetTypeDto, entityId: string, companyId: string) {
    try {
      const assetType = this.walletAssetTypeRepository.create({
        ...input,
        company: {
          id: companyId,
        },
        entity: {
          id: entityId,
        },
      });

      await this.walletAssetTypeRepository.save(assetType);
    } catch (error) {
      if (error.message.includes('violates foreign key constraint')) {
        throw new BadRequestException('Please provide a valid entity');
      }

      throw new InternalServerErrorException();
    }
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

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
