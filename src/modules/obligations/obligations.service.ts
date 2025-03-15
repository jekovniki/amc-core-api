import { Injectable } from '@nestjs/common';
import { CreateObligationDto } from './dto/create-obligation.dto';
// import { UpdateObligationDto } from './dto/update-obligation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Obligation } from './entities/obligation.entity';
import { Repository } from 'typeorm';
import { ObligationStatus } from './dto/obligation.enum';
import { RequestUserData } from 'src/shared/interface/server.interface';

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

  //   findOne(id: number) {
  //     return `This action returns a #${id} obligation`;
  //   }

  //   update() {
  //     return `This action updates a #${id} obligation`;
  //   }

  //   remove(id: number) {
  //     return `This action removes a #${id} obligation`;
  //   }
}
