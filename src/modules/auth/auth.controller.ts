import { Controller, Post, Get, Body, Patch, HttpCode, HttpStatus, UseGuards, Param } from '@nestjs/common';
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
import { User } from 'src/shared/decorator/user.decorator';
import { RequestRefreshUserToken, RequestUserData } from 'src/shared/interface/server.interface';
import { RefreshGuard } from 'src/shared/guard/refresh.guard';
import { RefreshToken } from './decorator/refresh.decorator';

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
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() input: SignUpAuthDto) {
    return this.authService.signUp(input);
  }

  @Patch('/password/change')
  changePassword(@Body() input: ChangePasswordAuthDto) {
    return this.authService.changePassword(input);
  }

  @Get('/password/request/:id')
  @HttpCode(HttpStatus.OK)
  requestNewPassword(@Param('id') id: string) {
    return this.authService.requestPassword(id);
  }

  @Public()
  @UseGuards(RefreshGuard)
  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@RefreshToken() user: RequestRefreshUserToken, @Res({ passthrough: true }) response: Response): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.refreshToken(user.id, user.refreshToken);

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
  }

  @Post('/sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(@User() user: RequestUserData, @Res({ passthrough: true }) response: Response): Promise<void> {
    await this.authService.signOut(user.id);

    response.clearCookie(TOKENS.ACCESS_TOKEN, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production', // Use secure in production
      sameSite: 'strict',
    });

    response.clearCookie(TOKENS.REFRESH_TOKEN, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production', // Use secure in production
      sameSite: 'strict',
    });
  }
}
