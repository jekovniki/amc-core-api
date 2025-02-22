import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UnauthorizedException,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import { TOKENS } from 'src/shared/util/token.util';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/shared/decorator/public.decorator';
import { Permission } from 'src/shared/decorator/permission.decorator';
import { User } from 'src/shared/decorator/user.decorator';
import { RequestUserData } from 'src/shared/interface/server.interface';

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
  @Permission('user:READ')
  findAll(@User() user: RequestUserData) {
    return this.userService.findAllByCompanyId(user.companyId);
  }

  @Get(':id')
  @Permission('user:READ')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Patch()
  @Permission('user:UPDATE')
  @HttpCode(HttpStatus.OK)
  async update(@User() user: RequestUserData, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(user.id, updateUserDto);

    return {
      id: user.id,
      message: 'Successfully updated user',
    };
  }

  @Delete(':id')
  @Permission('user:DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@User() user: RequestUserData, @Param('id') id: string) {
    if (user.id === id) {
      throw new BadRequestException("You can't delete yourself from the system");
    }
    await this.userService.remove(id, user.companyId);

    return;
  }
}
