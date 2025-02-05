import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { Public } from 'src/shared/decorator/public.decorator';

@Controller({
  path: 'roles',
  version: '1',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Public()
  @Get()
  async findAll() {
    try {
      return this.roleService.findAll();
    } catch (error) {
      return null;
    }
  }
}
