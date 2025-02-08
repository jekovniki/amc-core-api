import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  public async create({ name, uic, logo }: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create({ name, uic, logo });

    return await this.companyRepository.save(company);
  }

  public async findOne(id: string) {
    return this.companyRepository.findOneBy({ id });
  }

  public async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const existingCompany = await this.companyRepository.findOneBy({ id });

    if (!existingCompany) {
      throw new NotFoundException(`Company with ID "${id}" not found`);
    }

    const updatedCompany = {
      ...existingCompany,
      ...updateCompanyDto,
      updatedAt: new Date(),
    };

    return this.companyRepository.save(updatedCompany);
  }
}
