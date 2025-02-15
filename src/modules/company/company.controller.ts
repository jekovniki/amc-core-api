import { Controller, Get, Post, Body, Patch, Res } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public } from 'src/shared/decorator/public.decorator';
import { Permission } from 'src/shared/decorator/permission.decorator';
import { User } from 'src/shared/decorator/user.decorator';
import { RequestUserData } from 'src/shared/interface/server.interface';
import { Response } from 'express';
import { TOKENS } from 'src/shared/util/token.util';
import { getExpirationTime } from 'src/shared/util/time.util';
import { ConfigService } from '@nestjs/config';

@Controller({
  path: 'company',
  version: '1',
})
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @Public()
  async create(@Body() createCompanyDto: CreateCompanyDto, @Res({ passthrough: true }) response: Response) {
    const { data, registrationToken } = await this.companyService.create(createCompanyDto);

    response.cookie(TOKENS.COMPANY_REGISTRATION, registrationToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production', // Use secure in production
      sameSite: 'strict',
      maxAge: getExpirationTime.days(7),
    });

    return data;
  }

  @Get()
  @Permission('company:READ')
  findOne(@User() user: RequestUserData) {
    return this.companyService.findOne(user.companyId);
  }

  @Patch()
  update(@User() user: RequestUserData, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(user.companyId, updateCompanyDto);
  }
}
