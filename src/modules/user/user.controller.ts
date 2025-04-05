import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import { TOKENS } from 'src/shared/util/token.util';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/shared/decorator/public.decorator';
import { Permission } from 'src/shared/decorator/permission.decorator';
import { User } from 'src/shared/decorator/user.decorator';
import { RequestUserData } from 'src/shared/interface/server.interface';
import { CantDeleteYourselfException, InvalidCompanyTokenException, MissingCompanyTokenException } from './exceptions/user.exception';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const registrationToken = request.cookies[TOKENS.COMPANY_REGISTRATION];
    if (!registrationToken) {
      throw new MissingCompanyTokenException();
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
        throw new InvalidCompanyTokenException();
      }
      throw error;
    }
  }

  @Get()
  @Permission('users:READ')
  findAll(@User() user: RequestUserData) {
    return this.userService.findAllByCompanyId(user.companyId);
  }

  @Get(':id')
  @Permission('users:READ')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Patch()
  @Permission('user:UPDATE')
  @HttpCode(HttpStatus.OK)
  async update(@User() user: RequestUserData, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(user.id, user.companyId, updateUserDto);

    return {
      id: user.id,
      message: 'Successfully updated user',
    };
  }

  @Patch('/status/:id')
  @Permission('users:UPDATE')
  @HttpCode(HttpStatus.OK)
  async status(@User() user: RequestUserData, @Param('id') id: string, @Body() request: UpdateUserStatusDto) {
    await this.userService.update(id, user.companyId, { active: request.status });

    return {
      id,
      message: 'Successfully updated user',
    };
  }

  @Delete(':id')
  @Permission('users:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@User() user: RequestUserData, @Param('id') id: string) {
    if (user.id === id) {
      throw new CantDeleteYourselfException();
    }
    await this.userService.remove(id, user.companyId);

    return;
  }
}
