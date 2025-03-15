import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateObligationDto } from './dto/create-obligation.dto';
// import { UpdateObligationDto } from './dto/update-obligation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Obligation } from './entities/obligation.entity';
import { Repository } from 'typeorm';
import { ObligationStatus } from './dto/obligation.enum';
import { RequestUserData } from 'src/shared/interface/server.interface';
import { UpdateObligationDto } from './dto/update-obligation.dto';

@Injectable()
export class ObligationsService {
  constructor(
    @InjectRepository(Obligation)
    private readonly obligationRepository: Repository<Obligation>,
  ) {}
  async create(createObligationDto: CreateObligationDto, entityId: string, user: RequestUserData) {
    const newObligation = this.obligationRepository.create({
      ...createObligationDto,
      status: ObligationStatus.PENDING,
      entity: {
        id: entityId,
      },
      company: {
        id: user.companyId,
      },
      createdBy: {
        id: user.id,
      },
    });

    return this.obligationRepository.save(newObligation);
  }

  //   findAll() {
  //     return `This action returns all obligations`;
  //   }

  findOne(query: string, type: 'id' | 'companyId' | 'entityId' | 'status' = 'companyId') {
    if (type === 'status') {
      if (query !== ObligationStatus.DELETED && query !== ObligationStatus.PENDING && query !== ObligationStatus.RESOLVED) {
        throw new BadRequestException('Invalid status type');
      }
      return this.obligationRepository.findBy({ status: query });
    }
    if (type === 'companyId') {
      return this.obligationRepository.findBy({
        company: {
          id: query,
        },
      });
    }
    if (type === 'entityId') {
      return this.obligationRepository.findBy({
        entity: {
          id: query,
        },
      });
    }
    return this.obligationRepository.findBy({ id: query });
  }

  async update(id: string, input: UpdateObligationDto, companyId: string) {
    const existingObligation = await this.obligationRepository.findOneBy({
      id,
      company: {
        id: companyId,
      },
    });
    if (!existingObligation) {
      throw new NotFoundException(['Entity does not exist']);
    }
    let updatedEntity = {};
    if (input.newEntityId) {
      updatedEntity = {
        ...existingObligation,
        ...input,
        entity: {
          id: input.newEntityId,
        },
        updatedAt: new Date(),
      };
    } else {
      updatedEntity = { ...existingObligation, ...input, updatedAt: new Date() };
    }

    return this.obligationRepository.save(updatedEntity);
  }

  remove(id: string) {
    return this.obligationRepository.delete({ id });
  }
}
