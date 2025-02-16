import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import { TOKENS } from 'src/shared/util/token.util';
import { ConfigService } from '@nestjs/config';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const registrationToken = request.cookies[TOKENS.COMPANY_REGISTRATION];
    if (!registrationToken) {
      throw new UnauthorizedException('Company registration token is required');
    }

    try {
      // @note : why to pass options in clearCookie : https://expressjs.com/en/api.html#res.clearCookie
      response.clearCookie(TOKENS.COMPANY_REGISTRATION, {
        httpOnly: true,
        secure: this.configService.getOrThrow('NODE_ENV') === 'production', // Use secure in production
        sameSite: 'strict',
      });

      return this.userService.create(createUserDto, registrationToken);
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Invalid or expired registration token');
      }
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
