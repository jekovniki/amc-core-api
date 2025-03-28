import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
// import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { isNumber } from 'class-validator';

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

  findAll() {
    return `This action returns all wallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  //   update(id: number, updateWalletDto: UpdateWalletDto) {
  //     return `This action updates a #${id} wallet`;
  //   }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
