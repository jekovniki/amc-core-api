import { Injectable } from '@nestjs/common';
import { CreateWalletAssetDto } from './dto/create-wallet-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { AssetQueryParamFilter, WalletStructureFilter } from './dto/wallet.enum';
import { GetWalletStructureResponse } from './dto/wallet.type';
import { EntityIdentifier } from 'src/shared/interface/entity.type';
import { UpdateWalletAssetDto } from './dto/update-wallet-asset.dto';
import { AssetNotFoundException } from './exceptions/wallet.exceptions';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  public async create(input: CreateWalletAssetDto, { entityId, companyId }: EntityIdentifier) {
    const rule = this.walletRepository.create({
      ...input,
      company: {
        id: companyId,
      },
      entity: {
        id: entityId,
      },
    });

    await this.walletRepository.insert(rule);

    return;
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
    input: UpdateWalletAssetDto,
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
      relations: ['assetType'],
    });

    if (!itemsToUpdate) {
      return new AssetNotFoundException();
    }

    if (input.amount && input.amount !== itemsToUpdate.length) {
      //   if (input.amount > itemsToUpdate.length) {
      //     await this.createWithStreaming({ ...input, amount: input.amount - itemsToUpdate.length }, { entityId, companyId });
      //   }

      if (itemsToUpdate.length > input.amount) {
        await this.deleteAsset(selectValue, selectBy, itemsToUpdate.length - input.amount, { entityId, companyId });
      }
    }

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.code !== undefined) updateData.code = input.code;
    if (input.isin !== undefined) updateData.isin = input.isin;
    if (input.value !== undefined) updateData.value = input.value;
    if (input.currency !== undefined) updateData.currency = input.currency;
    if (input.assetTypeId !== undefined) updateData.assetType = { id: input.assetTypeId };

    if (Object.keys(updateData).length > 0) {
      const itemIds = itemsToUpdate.map((item) => item.id);
      await this.walletRepository.update(itemIds, updateData);
    }

    const updatedItems = await this.walletRepository.find({
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

    return {
      updated: updatedItems.length,
      assets: updatedItems,
    };
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
      throw new AssetNotFoundException();
    }
    const idsToDelete = itemsToDelete.map((item) => item.id);

    const deleteResult = await this.walletRepository.delete(idsToDelete);

    return {
      deleted: deleteResult.affected || 0,
      requested: amount,
    };
  }
}
