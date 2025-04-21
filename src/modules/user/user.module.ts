import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { MailService } from 'src/shared/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({}), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, MailService],
  exports: [UserService],
})
export class UserModule {}
