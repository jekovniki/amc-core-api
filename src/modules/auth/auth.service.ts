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
    const permissions = user.role.permissions.map((permission) => `${permission.feature}:${permission.permission}`);

    const refreshToken = this.jwtService.sign(
      {
        iss: this.configService.getOrThrow('APP_URL'),
        sub: user.id,
        cid: user.company.id,
        iat: Math.floor(Date.now() / 1000),
      },
      {
        expiresIn: getExpirationTime.days(7),
        secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      },
    );

    await this.userService.update(user.id, user.company.id, { refreshToken });

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
          iat: Math.floor(Date.now() / 1000),
        },
        {
          expiresIn: getExpirationTime.minutes(30),
          secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
        },
      ),
      refreshToken: refreshToken,
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

    return this.userService.update(sub, user.company.id, {
      password: await hashData(input.password, this.configService),
      firstName: input.firstName,
      lastName: input.lastName,
      job: input.lastName,
      active: true,
    });
  }

  async requestPassword(id: string) {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const resetPasswordToken = this.jwtService.sign(
      {
        iss: this.configService.getOrThrow('APP_URL'),
        sub: user.id,
        cid: user.company.id,
        iat: Math.floor(Date.now() / 1000),
      },
      {
        expiresIn: getExpirationTime.minutes(60),
        secret: this.configService.getOrThrow('RESET_PASSWORD_TOKEN_SECRET'),
      },
    );

    console.log(`User: ${user.email} requested new password. Token: ${resetPasswordToken}`);
    // Send password email

    return;
  }

  async changePassword(input: ChangePasswordAuthDto) {
    const { sub } = this.jwtService.verify(input.changePasswordToken, {
      secret: this.configService.getOrThrow('RESET_PASSWORD_TOKEN_SECRET'),
    });

    const user = await this.userService.findOneById(sub);
    if (!user || user.email !== input.email) {
      throw new BadRequestException('Invalid request');
    }

    const isSamePassword = await validateHash(input.password, user?.password || '');
    if (isSamePassword) {
      throw new BadRequestException('New password should not be the same as the old password');
    }

    return this.userService.update(sub, user.company.id, {
      password: await hashData(input.password, this.configService),
    });
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findOneById(userId);

    if (!user || !user?.refreshToken) {
      throw new BadRequestException('Wrong credentials');
    }

    if (user.refreshToken !== refreshToken) {
      throw new BadRequestException('Invalid request token');
    }

    const newRefreshToken = this.jwtService.sign(
      {
        iss: this.configService.getOrThrow('APP_URL'),
        sub: user.id,
        cid: user.company.id,
        iat: Math.floor(Date.now() / 1000),
      },
      {
        expiresIn: getExpirationTime.days(7),
        secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      },
    );

    await this.userService.update(user.id, user.company.id, { refreshToken });

    const permissions = user.role.permissions.map((permission) => `${permission.feature}:${permission.permission}`);

    return {
      accessToken: this.jwtService.sign(
        {
          iss: this.configService.getOrThrow('APP_URL'),
          sub: user.id,
          cid: user.company.id,
          role: user.role.name,
          scope: permissions,
          iat: Math.floor(Date.now() / 1000),
        },
        {
          expiresIn: getExpirationTime.minutes(30),
          secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
        },
      ),
      refreshToken: newRefreshToken,
    };
  }

  async signOut(id: string, companyId: string) {
    return this.userService.update(id, companyId, {
      refreshToken: '',
    });
  }
}
