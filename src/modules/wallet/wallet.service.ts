import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { isNumber } from 'class-validator';
import { WalletStructureFilter } from './dto/wallet.enum';
import { GetWalletStructureResponse } from './dto/wallet.type';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly configService: ConfigService,
  ) {}

  public async createWithStreaming(input: CreateWalletDto, entityId: string, companyId: string) {
    const BATCH_SIZE = Number(this.configService.getOrThrow('WALLET_BATCH_SIZE'));
    if (!isNumber(BATCH_SIZE)) {
      console.error('Invalid batch size. It needs to be number. Check the config file');
      throw new InternalServerErrorException();
    }

    for (let offset = 0; offset < input.amount; offset += BATCH_SIZE) {
      const batchLimit = Math.min(BATCH_SIZE, input.amount - offset);
      const batchInput = { ...input, amount: batchLimit };

      const walletsToInsert = this.prepareBulkWalletData(batchInput, entityId, companyId);

      await this.walletRepository.insert(walletsToInsert);
    }
  }

  private prepareBulkWalletData(input: CreateWalletDto, entityId: string, companyId: string): Partial<Wallet>[] {
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

  async getWalletStructure(groupBy: WalletStructureFilter, entityId: string, companyId: string) {
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
}
