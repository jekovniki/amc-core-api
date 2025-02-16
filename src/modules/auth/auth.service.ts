import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { ChangePasswordAuthDto } from './dto/change-password-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { hashData, validateHash } from './util/hash.util';
import { getExpirationTime } from 'src/shared/util/time.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}
  async signIn(input: SignInAuthDto): Promise<{
    sessionData: string;
    refreshToken: string;
    accessToken: string;
  }> {
    const user = await this.userService.findOneByEmail(input.email);
    if (!user) {
      throw new BadRequestException('Wrong credentials');
    }
    if (!user.password) {
      throw new BadRequestException('Please complete registration before you try to sign in');
    }
    if (!user.active) {
      throw new BadRequestException('The user is no longer active');
    }
    const isValidPassword = await validateHash(input.password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException('Wrong credentials');
    }
    console.log('user : ', user);
    console.log('permissions : ', user.role.permissions);

    const permissions = user.role.permissions.map((permission) => `${permission.feature}:${permission.permission}`);

    return {
      sessionData: btoa(
        JSON.stringify({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          job: user.job,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          permissions,
          role: user.role.name,
        }),
      ),
      accessToken: this.jwtService.sign(
        {
          iss: this.configService.getOrThrow('APP_URL'),
          sub: user.id,
          cid: user.company.id,
          role: user.role.name,
          scope: permissions,
        },
        {
          expiresIn: getExpirationTime.minutes(30),
          secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
        },
      ),
      refreshToken: this.jwtService.sign(
        {
          iss: this.configService.getOrThrow('APP_URL'),
          sub: user.id,
          cid: user.company.id,
        },
        {
          expiresIn: getExpirationTime.days(7),
          secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
        },
      ),
    };
  }

  async signUp(input: SignUpAuthDto) {
    const { sub } = this.jwtService.verify(input.registrationToken, {
      secret: this.configService.getOrThrow('USER_REGISTER_TOKEN_SECRET'),
    });

    const user = await this.userService.findOneById(sub);
    if (!user) {
      throw new BadRequestException('User no longer exists');
    }
    if (user.active || (!user.active && user.password)) {
      throw new BadRequestException('User has already been registered');
    }

    return this.userService.update(sub, {
      password: await hashData(input.password, this.configService),
      firstName: input.firstName,
      lastName: input.lastName,
      job: input.lastName,
      active: true,
    });
  }

  changePassword(input: ChangePasswordAuthDto) {
    console.log('input: ', input);

    return true;
  }
}
