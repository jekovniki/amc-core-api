import { Controller, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { Public } from 'src/shared/decorator/public.decorator';
import { ChangePasswordAuthDto } from './dto/change-password-auth.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Public()
  signIn(@Body() credentials: SignInAuthDto) {
    return this.authService.signIn(credentials);
  }

  @Post()
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
