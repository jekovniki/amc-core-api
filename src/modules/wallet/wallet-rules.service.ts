import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletRules } from './entities/wallet-rules.entity';
import { EntityIdentifier } from 'src/shared/interface/entity.type';
import { CreateWalletRuleDto } from './dto/create-wallet-rule.dto';
import { UpdateWalletRuleDto } from './dto/update-wallet-rule.dto';

@Injectable()
export class WalletRulesService {
  constructor(
    @InjectRepository(WalletRules)
    private readonly walletRulesRepository: Repository<WalletRules>,
  ) {}

  public async findAllRules({ entityId, companyId }: EntityIdentifier) {
    return this.walletRulesRepository.find({
      where: {
        company: {
          id: companyId,
        },
        entity: {
          id: entityId,
        },
      },
    });
  }

  public async findRule(id: number, { entityId, companyId }: EntityIdentifier) {
    return this.walletRulesRepository.findOne({
      where: {
        id,
        company: {
          id: companyId,
        },
        entity: {
          id: entityId,
        },
      },
    });
  }

  public async addRule(input: CreateWalletRuleDto, { entityId, companyId }: EntityIdentifier) {
    const rule = this.walletRulesRepository.create({
      ...input,
      company: {
        id: companyId,
      },
      entity: {
        id: entityId,
      },
    });

    await this.walletRulesRepository.insert(rule);

    return;
  }

  public async updateRule(id: number, input: UpdateWalletRuleDto, { entityId, companyId }: EntityIdentifier) {
    return this.walletRulesRepository.update(
      {
        id,
        company: {
          id: companyId,
        },
        entity: {
          id: entityId,
        },
      },
      input,
    );
  }

  public async deleteRule(id: number, { entityId, companyId }: EntityIdentifier) {
    return this.walletRulesRepository.delete({
      id,
      company: {
        id: companyId,
      },
      entity: {
        id: entityId,
      },
    });
  }
}
