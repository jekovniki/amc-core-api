import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RoleService } from '../auth/role.service';
import { getExpirationTime } from 'src/shared/util/time.util';
import { CantDeleteUsersFromOtherCompaniesException, RoleNotFoundException, UserNotFoundException } from './exceptions/user.exception';
import { MailService } from 'src/shared/mail/mail.service';
import { logger } from 'src/shared/util/logger.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto, registrationToken: string): Promise<void> {
    const { sub, cName } = this.jwtService.verify(registrationToken, {
      secret: this.configService.getOrThrow('COMPANY_REGISTER_TOKEN_SECRET'),
    });

    await Promise.all(
      createUserDto.users.map(async ({ email, role_id }) => {
        const role = await this.roleService.findById(role_id);
        if (!role) {
          throw new RoleNotFoundException(role_id);
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

        await this.mailService.sendTemplateEmail(user.email, 'register-bg', `AMC Manager - Регистрация`, {
          email: user.email,
          registerLink: `${this.configService.getOrThrow('USER_REGISTER_PAGE')}?email=${user.email}&companyName=${cName}&registerToken=${registerToken}`,
          companyName: cName,
        });
        // Send email here
        logger.info(`The following token was send to email: ${user.email} . Token: ${registerToken}`);
      }),
    );

    return;
  }

  async findAllByCompanyId(id: string) {
    const response = await this.userRepository.find({
      where: {
        company: {
          id: id,
        },
      },
      relations: {
        role: true,
      },
    });
    const users = [];

    for (const user of response) {
      const userData: any = user;
      delete userData.active;
      delete userData.password;
      delete userData.refreshToken;

      users.push(userData);
    }

    return users;
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
      throw new UserNotFoundException();
    }
    if (user.company.id !== companyId) {
      throw new CantDeleteUsersFromOtherCompaniesException();
    }

    let role;
    if (updateUserDto.roleId !== undefined) {
      role = await this.roleService.findById(updateUserDto.roleId);
      if (!role) {
        throw new RoleNotFoundException(updateUserDto.roleId);
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
      throw new CantDeleteUsersFromOtherCompaniesException();
    }

    return this.userRepository.delete(id);
  }
}
