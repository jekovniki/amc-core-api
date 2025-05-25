import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletGroup } from './entities/wallet-group.entity';
import { WalletAssetGroup } from './entities/wallet-asset-group.entity';
import { CreateWalletGroupDto } from './dto/create-wallet-group.dto';
import { CreateWalletAssetGroupDto } from './dto/create-wallet-asset-group.dto';
import { UpdateWalletGroupDto } from './dto/update-wallet-group.dto';
import { UpdateWalletAssetGroupDto } from './dto/update-wallet-asset-group.dto';

@Injectable()
export class WalletGroupService {
  constructor(
    @InjectRepository(WalletGroup)
    private readonly walletGroupRepository: Repository<WalletGroup>,
    @InjectRepository(WalletAssetGroup)
    private readonly walletAssetGroupRepository: Repository<WalletAssetGroup>,
  ) {}

  public async findAllGroups(entityId: string) {
    return this.walletGroupRepository.find({
      where: {
        entity: {
          id: entityId,
        },
      },
      relations: {
        walletAssetGroup: true,
      },
    });
  }

  public async findGroup(id: number, entityId: string) {
    return this.walletGroupRepository.findOne({
      where: {
        id,
        entity: {
          id: entityId,
        },
      },
      relations: ['group'],
    });
  }

  public async addGroup(input: CreateWalletGroupDto, entityId: string) {
    const group = this.walletGroupRepository.create({
      ...input,
      entity: {
        id: entityId,
      },
    });

    await this.walletGroupRepository.insert(group);

    return;
  }

  public async updateGroup(id: number, input: UpdateWalletGroupDto, entityId: string) {
    return this.walletGroupRepository.update(
      {
        id,
        entity: {
          id: entityId,
        },
      },
      input,
    );
  }

  public async deleteGroup(id: number, entityId: string) {
    return this.walletGroupRepository.delete({
      id,
      entity: {
        id: entityId,
      },
    });
  }

  public async addAssetToGroup(input: CreateWalletAssetGroupDto, groupId: number, entityId: string) {
    const group = this.walletAssetGroupRepository.create({
      assetCode: input.code,
      group: {
        id: groupId,
      },
      entity: {
        id: entityId,
      },
    });

    await this.walletAssetGroupRepository.insert(group);

    return;
  }

  public async updateAssetToGroup(id: number, groupId: number, input: UpdateWalletAssetGroupDto) {
    return this.walletAssetGroupRepository.update(
      {
        id,
      },
      {
        assetCode: input.code,
        group: {
          id: groupId,
        },
      },
    );
  }

  public async deleteAssetToGroup(id: number, entityId: string) {
    return this.walletAssetGroupRepository.delete({
      id,
      entity: {
        id: entityId,
      },
    });
  }
}
