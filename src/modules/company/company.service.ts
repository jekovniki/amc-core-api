import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly dataSource: DataSource,
  ) {}

  public async create({ name, uic }: CreateCompanyDto) {
    return this.companyRepository.insert({ name, uic });
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
