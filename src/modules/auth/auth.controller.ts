import { Controller, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { Public } from 'src/shared/decorator/public.decorator';
import { ChangePasswordAuthDto } from './dto/change-password-auth.dto';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { getExpirationTime } from 'src/shared/util/time.util';
import { TOKENS } from 'src/shared/util/token.util';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/sign-in')
  @Public()
  async signIn(@Body() credentials: SignInAuthDto, @Res({ passthrough: true }) response: Response) {
    const { sessionData, refreshToken, accessToken } = await this.authService.signIn(credentials);

    response.cookie(TOKENS.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production', // Use secure in production
      sameSite: 'strict',
      maxAge: getExpirationTime.days(30),
    });

    response.cookie(TOKENS.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production', // Use secure in production
      sameSite: 'strict',
      maxAge: getExpirationTime.minutes(60),
    });

    return { sessionData };
  }

  @Post('/sign-up')
  @Public()
  signUp(@Body() input: SignUpAuthDto) {
    return this.authService.signUp(input);
  }

  @Patch()
  changePassword(@Body() input: ChangePasswordAuthDto) {
    return this.authService.changePassword(input);
  }

  @Post()
  signOut() {}
}
