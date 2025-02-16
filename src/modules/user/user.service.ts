import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RoleService } from '../role/role.service';
import { getExpirationTime } from 'src/shared/util/time.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto, registrationToken: string): Promise<void> {
    const { sub } = this.jwtService.verify(registrationToken, {
      secret: this.configService.getOrThrow('COMPANY_REGISTER_TOKEN_SECRET'),
    });

    await Promise.all(
      createUserDto.users.map(async ({ email, role_id }) => {
        const role = await this.roleService.findById(role_id);
        if (!role) {
          throw new NotFoundException(`Role with ID ${role_id} not found`);
        }

        const newUser = this.userRepository.create({ email, role, company: sub });
        const user = await this.userRepository.save(newUser);

        const registerToken = this.jwtService.sign(
          {
            iss: this.configService.getOrThrow('APP_URL'),
            sub: user.id,
          },
          {
            expiresIn: getExpirationTime.days(7),
            secret: this.configService.getOrThrow('USER_REGISTER_TOKEN_SECRET'),
          },
        );

        console.log(`The following token was send to email: ${user.email} . Token: ${registerToken}`);
      }),
    );

    return;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: {
        role: {
          permissions: true,
        },
        company: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    let role;
    if (updateUserDto.role_id !== undefined) {
      role = await this.roleService.findById(updateUserDto.role_id);
      if (!role) {
        throw new NotFoundException(`Role with ID ${updateUserDto.role_id} not found`);
      }
    }

    const updateData: Partial<User> = {};

    if (updateUserDto.email !== undefined) updateData.email = updateUserDto.email;
    if (updateUserDto.firstName !== undefined) updateData.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName !== undefined) updateData.lastName = updateUserDto.lastName;
    if (updateUserDto.job !== undefined) updateData.job = updateUserDto.job;
    if (updateUserDto.password !== undefined) updateData.password = updateUserDto.password;
    if (updateUserDto.active !== undefined) updateData.active = updateUserDto.active;
    if (role !== undefined) updateData.role = role;

    return this.userRepository.update(id, updateData);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
