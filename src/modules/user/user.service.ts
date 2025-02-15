import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto, registrationToken: string) {
    const { iss, sub } = this.jwtService.verify(registrationToken, {
      secret: this.configService.getOrThrow('COMPANY_REGISTER_TOKEN_SECRET'),
    });
    if (iss !== this.configService.getOrThrow('APP_URL')) {
      throw new UnauthorizedException('Invalid or expired registration token');
    }

    await Promise.all(
      createUserDto.users.map(async ({ email, role_id }) => {
        const role = await this.roleService.findById(role_id);
        if (!role) {
          throw new NotFoundException(`Role with ID ${role_id} not found`);
        }

        const newUser = this.userRepository.create({ email, role, company: sub });
        return this.userRepository.save(newUser);
      }),
    );

    return;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
