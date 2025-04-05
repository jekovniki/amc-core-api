import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getExpirationTime } from 'src/shared/util/time.util';
import { CompanyNotFoundException } from './exceptions/company.exceptions';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async create({ name, uic, logo }: CreateCompanyDto): Promise<{ data: Company; registrationToken: string }> {
    const newCompany = this.companyRepository.create({ name, uic, logo });
    const company = await this.companyRepository.save(newCompany);
    const registrationToken = this.jwtService.sign(
      {
        iss: this.configService.getOrThrow('APP_URL'),
        sub: company.id,
      },
      {
        expiresIn: getExpirationTime.days(7),
        secret: this.configService.getOrThrow('COMPANY_REGISTER_TOKEN_SECRET'),
      },
    );

    return {
      data: company,
      registrationToken: registrationToken,
    };
  }

  public async findOne(id: string) {
    return this.companyRepository.findOneBy({ id });
  }

  public async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const existingCompany = await this.companyRepository.findOneBy({ id });

    if (!existingCompany) {
      throw new CompanyNotFoundException(id);
    }

    const updatedCompany = {
      ...existingCompany,
      ...updateCompanyDto,
      updatedAt: new Date(),
    };

    await this.companyRepository.update(id, updatedCompany);

    return this.companyRepository.findOneBy({ id });
  }
}
