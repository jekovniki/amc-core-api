import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RoleService } from '../auth/role.service';
import { getExpirationTime } from 'src/shared/util/time.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => RoleService))
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

        // Send email here
        console.log(`The following token was send to email: ${user.email} . Token: ${registerToken}`);
      }),
    );

    return;
  }

  async findAllByCompanyId(id: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.company', 'company')
      .where('company.id = :id', { id })
      .select(['user.id', 'user.email', 'user.firstName', 'user.lastName', 'user.createdAt', 'user.updatedAt'])
      .getMany();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        role: {
          permissions: true,
        },
        company: true,
      },
    });
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

  async update(id: string, companyId: string, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (user.company.id !== companyId) {
      throw new BadRequestException("You can't delete users from different companies");
    }

    let role;
    if (updateUserDto.roleId !== undefined) {
      role = await this.roleService.findById(updateUserDto.roleId);
      if (!role) {
        throw new NotFoundException(`Role with ID ${updateUserDto.roleId} not found`);
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
    if (updateUserDto.refreshToken !== undefined) updateData.refreshToken = updateUserDto.refreshToken;

    return this.userRepository.update(id, updateData);
  }

  async remove(id: string, companyId: string) {
    const user = await this.findOneById(id);
    if (!user) {
      return;
    }

    if (user.company.id !== companyId) {
      throw new BadRequestException("You can't delete users from different companies");
    }

    return this.userRepository.delete(id);
  }
}
