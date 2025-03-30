import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateWalletAssetDto } from './dto/create-wallet-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { isNumber } from 'class-validator';
import { AssetQueryParamFilter, WalletStructureFilter } from './dto/wallet.enum';
import { GetWalletStructureResponse } from './dto/wallet.type';
import { EntityIdentifier } from 'src/shared/interface/entity.type';
import { UpdateWalletAssetDto } from './dto/update-wallet-asset.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly configService: ConfigService,
  ) {}

  public async createWithStreaming(input: CreateWalletAssetDto, { entityId, companyId }: EntityIdentifier) {
    const BATCH_SIZE = Number(this.configService.getOrThrow('WALLET_BATCH_SIZE'));
    if (!isNumber(BATCH_SIZE)) {
      console.error('Invalid batch size. It needs to be number. Check the config file');
      throw new InternalServerErrorException();
    }

    for (let offset = 0; offset < input.amount; offset += BATCH_SIZE) {
      const batchLimit = Math.min(BATCH_SIZE, input.amount - offset);
      const batchInput = { ...input, amount: batchLimit };

      const walletsToInsert = this.prepareBulkWalletData(batchInput, { entityId, companyId });

      await this.walletRepository.insert(walletsToInsert);
    }
  }

  private prepareBulkWalletData(input: CreateWalletAssetDto, { entityId, companyId }: EntityIdentifier): Partial<Wallet>[] {
    const wallets: any[] = [];

    for (let i = 1; i <= input.amount; i++) {
      wallets.push({
        name: input.name,
        code: input.code,
        isin: input.isin,
        value: input.value,
        currency: input.currency,
        company: { id: companyId },
        entity: { id: entityId },
        assetType: {
          id: input.assetTypeId,
        },
      });
    }

    return wallets;
  }

  async getAsset(value: string, selectBy: AssetQueryParamFilter, { entityId, companyId }: EntityIdentifier) {
    const [items, count] = await this.walletRepository.findAndCount({
      where: {
        [selectBy]: value,
        entity: {
          id: entityId,
        },
        company: {
          id: companyId,
        },
      },
    });
    let totalAmount = 0;
    if (!items || !items.length) {
      return {
        assets: [],
        totalAmount,
        total: 0,
      };
    }
    for (const item of items) {
      totalAmount += Number(item.value);
    }

    const countMap = new Map();
    const valueMap = new Map();
    const key = selectBy === AssetQueryParamFilter.Code ? AssetQueryParamFilter.ISIN : selectBy;

    for (const item of items) {
      const itemKey = item[key];
      if (!countMap.has(itemKey)) {
        countMap.set(itemKey, 1);
        valueMap.set(itemKey, Number(item.value));
      } else {
        countMap.set(itemKey, countMap.get(itemKey) + 1);
        valueMap.set(itemKey, valueMap.get(itemKey) + Number(item.value));
      }
    }

    let uniqueItems = undefined;
    if (selectBy === AssetQueryParamFilter.ISIN) {
      uniqueItems = [...new Map(items.map((item) => [item[selectBy], item])).values()];
    } else {
      uniqueItems = [...new Map(items.map((item) => [item[AssetQueryParamFilter.ISIN], item])).values()];
    }

    uniqueItems = uniqueItems.map((item) => {
      const itemKey = item[key];
      return {
        ...item,
        total: countMap.get(itemKey),
        totalAmount: Number((countMap.get(itemKey) * Number(item.value)).toFixed(2)),
      };
    });

    return {
      assets: uniqueItems,
      totalAmount: Number(totalAmount.toFixed(2)),
      total: count,
    };
  }

  async getWalletStructure(groupBy: WalletStructureFilter, { entityId, companyId }: EntityIdentifier) {
    const walletStructure: GetWalletStructureResponse[] = await this.walletRepository.query(
      `
        SELECT
            COALESCE(${groupBy}::text, 'TOTAL') as "groupKey",
            COUNT(*) as "assetCount",
            SUM(value) as "totalValue",
            CASE
                WHEN ${groupBy} IS NULL THEN 100.0
                ELSE ROUND ((SUM(value) / (
                SELECT SUM(value) FROM wallet
                WHERE company_id = $1
                AND entity_id = $2)) * 100, 2)
            END as percentage
        FROM wallet
        WHERE
            company_id = $1
            AND entity_id = $2
        GROUP BY ROLLUP(${groupBy})
        ORDER BY
            CASE
                WHEN ${groupBy} IS NULL THEN 1
                ELSE 0
            END,
            "totalValue" DESC;
        `,
      [companyId, entityId],
    );

    return {
      overview: walletStructure?.find((item) => item.groupKey === 'TOTAL'),
      assets: walletStructure?.filter((item) => item.groupKey !== 'TOTAL'),
    };
  }

  async updateAsset(
    selectValue: string,
    selectBy: AssetQueryParamFilter,
    input: Omit<UpdateWalletAssetDto, 'entityId'>,
    { entityId, companyId }: EntityIdentifier,
  ) {
    const itemsToUpdate = await this.walletRepository.find({
      where: {
        [selectBy]: selectValue,
        entity: {
          id: entityId,
        },
        company: {
          id: companyId,
        },
      },
    });

    if (!itemsToUpdate) {
      return new BadRequestException('No asset to update');
    }

    return itemsToUpdate;
  }

  async deleteAsset(selectValue: string, selectBy: AssetQueryParamFilter, amount: number, { entityId, companyId }: EntityIdentifier) {
    const itemsToDelete = await this.walletRepository.find({
      where: {
        [selectBy]: selectValue,
        entity: {
          id: entityId,
        },
        company: {
          id: companyId,
        },
      },
      take: amount,
    });
    if (!itemsToDelete || !itemsToDelete.length) {
      throw new BadRequestException('No assets found to delete');
    }
    const idsToDelete = itemsToDelete.map((item) => item.id);

    const deleteResult = await this.walletRepository.delete(idsToDelete);

    return {
      deleted: deleteResult.affected || 0,
      requested: amount,
    };
  }
}
