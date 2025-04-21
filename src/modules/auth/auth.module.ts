import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategy/access-token.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { EntityModule } from '../entity/entity.module';
import { MailService } from 'src/shared/mail/mail.service';

@Module({
  imports: [JwtModule.register({}), UserModule, TypeOrmModule.forFeature([Permission, Role]), EntityModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, RoleService, MailService],
  exports: [RoleService],
})
export class AuthModule {}
