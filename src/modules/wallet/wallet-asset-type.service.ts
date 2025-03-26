import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletAssetType } from './entities/wallet-asset-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WalletAssetTypeService {
  constructor(
    @InjectRepository(WalletAssetType)
    private readonly walletAssetTypeRepository: Repository<WalletAssetType>,
  ) {}

  create() {
    return 'This action adds a new wallet';
  }

  findAll(companyId: string) {
    return this.walletAssetTypeRepository.findBy({
      company: {
        id: companyId,
      },
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
