import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TOKENS } from 'src/shared/util/token.util';
import { AccessTokenPayload } from '../dto/tokens.type';
import { RequestUserData } from 'src/shared/interface/server.interface';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access') {
  private readonly configService: ConfigService;
  constructor(
    configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: (request) => {
        if (request && request.headers && request.headers.cookie) {
          const cookies = this.parseCookies(request.headers.cookie);

          return cookies[TOKENS.ACCESS_TOKEN];
        }

        return null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
    this.configService = configService;
  }

  public validate(req: Request): RequestUserData {
    const cookies = req?.headers?.cookie ? this.parseCookies(req.headers.cookie) : {};

    const token = cookies[TOKENS.ACCESS_TOKEN];

    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    try {
      const payload: AccessTokenPayload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
      });

      return {
        id: payload.sub,
        companyId: payload.cid,
        entityIds: payload.eid,
        permissions: payload.scope,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private parseCookies(cookieHeader: string): { [key: string]: string } {
    const list: { [key: string]: string } = {};
    cookieHeader.split(';').forEach((cookie) => {
      // eslint-disable-next-line prefer-const
      let [name, ...rest] = cookie.split('=');
      name = name?.trim();
      if (!name) return;
      const value = rest.join('=').trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
    });
    return list;
  }
}
