import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public } from 'src/shared/decorator/public.decorator';
import { Permission } from 'src/shared/decorator/permission.decorator';
import { User } from 'src/shared/decorator/user.decorator';
import { RequestUserData } from 'src/shared/interface/server.interface';

@Controller({
  path: 'company',
  version: '1',
})
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Public()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
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
