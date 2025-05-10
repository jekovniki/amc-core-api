import { Injectable } from '@nestjs/common';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { ChangePasswordAuthDto } from './dto/change-password-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { hashData, validateHash } from './util/hash.util';
import { getExpirationTime } from 'src/shared/util/time.util';
import { EntityService } from '../entity/entity.service';
import { SessionDataResponse } from './dto/tokens.type';
import { User } from '../user/entities/user.entity';
import {
  AlreadyRegisteredUserException,
  InactiveUserException,
  IncompleteRegistrationException,
  InvalidCredentialsException,
  InvalidRefreshTokenException,
  SamePasswordException,
  UserNotFoundException,
} from './exceptions/auth.exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly entityService: EntityService,
  ) {}
  async signIn(input: SignInAuthDto): Promise<SessionDataResponse> {
    const user = await this.userService.findOneByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }
    if (!user.password) {
      throw new IncompleteRegistrationException();
    }
    if (!user.active) {
      throw new InactiveUserException();
    }
    const isValidPassword = await validateHash(input.password, user.password);
    if (!isValidPassword) {
      throw new InvalidCredentialsException();
    }

    return await this.getSessionData(user);
  }

  async signUp(input: SignUpAuthDto) {
    const { sub } = this.jwtService.verify(input.registrationToken, {
      secret: this.configService.getOrThrow('USER_REGISTER_TOKEN_SECRET'),
    });

    const user = await this.userService.findOneById(sub);
    if (!user) {
      throw new UserNotFoundException();
    }
    if (user.active || (!user.active && user.password)) {
      throw new AlreadyRegisteredUserException();
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
      throw new UserNotFoundException();
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
      throw new UserNotFoundException();
    }

    const isSamePassword = await validateHash(input.password, user?.password || '');
    if (isSamePassword) {
      throw new SamePasswordException();
    }

    return this.userService.update(sub, user.company.id, {
      password: await hashData(input.password, this.configService),
    });
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findOneById(userId);

    if (!user || !user?.refreshToken) {
      throw new InvalidCredentialsException();
    }

    if (user.refreshToken !== refreshToken) {
      throw new InvalidRefreshTokenException();
    }

    return await this.getSessionData(user);
  }

  async signOut(id: string, companyId: string) {
    return this.userService.update(id, companyId, {
      refreshToken: '',
    });
  }

  private async getSessionData(user: User): Promise<SessionDataResponse> {
    const permissions = user.role.permissions.map((permission) => `${permission.feature}:${permission.permission}`);
    const userCompanyEntity = await this.entityService.findAllCompanyEntities(user.company.id);

    const entities = userCompanyEntity?.map((entity) => entity.id) || [];

    const accessToken = this.jwtService.sign(
      {
        iss: this.configService.getOrThrow('APP_URL'),
        sub: user.id,
        cid: user.company.id,
        eid: entities,
        role: user.role.name,
        scope: permissions,
        iat: Math.floor(Date.now() / 1000),
      },
      {
        expiresIn: getExpirationTime.minutes(30),
        secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        iss: this.configService.getOrThrow('APP_URL'),
        sub: user.id,
        cid: user.company.id,
        eid: entities,
        iat: Math.floor(Date.now() / 1000),
      },
      {
        expiresIn: getExpirationTime.days(7),
        secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      },
    );

    await this.userService.update(user.id, user.company.id, { refreshToken });
    return {
      sessionData: Buffer.from(
        JSON.stringify({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          job: user.job,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          permissions,
          companyId: user.company.id,
          entities: entities,
          role: user.role.name,
        }),
      ).toString('base64'),
      accessToken: accessToken,
      refreshToken,
    };
  }
}
