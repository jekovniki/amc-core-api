import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TOKENS } from 'src/shared/util/token.util';
import { RefreshTokenPayload } from '../dto/tokens.type';
import { RequestRefreshUserToken } from 'src/shared/interface/server.interface';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh') {
  private readonly configService: ConfigService;
  constructor(
    configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: (request) => {
        if (request && request.headers && request.headers.cookie) {
          const cookies = this.parseCookies(request.headers.cookie);

          return cookies[TOKENS.REFRESH_TOKEN];
        }

        return null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
    this.configService = configService;
  }

  public validate(req: Request): RequestRefreshUserToken {
    const cookies = req?.headers?.cookie ? this.parseCookies(req.headers.cookie) : {};

    const token = cookies[TOKENS.REFRESH_TOKEN];

    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload: RefreshTokenPayload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      });

      return {
        id: payload.sub,
        companyId: payload.cid,
        refreshToken: token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
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
