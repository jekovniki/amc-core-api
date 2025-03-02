import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { CompanyModule } from './modules/company/company.module';
import { UserModule } from './modules/user/user.module';
import { IsUnique } from './shared/util/validator/is-unique-validator.util';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './shared/guard/access.guard';
import { PermissionGuard } from './shared/guard/permission.guard';
import { EntitiesModule } from './modules/entities/entities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    CompanyModule,
    UserModule,
    EntitiesModule,
  ],
  providers: [
    IsUnique,
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
