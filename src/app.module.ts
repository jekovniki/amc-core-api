import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { UserModule } from './modules/user/user.module';
import { IsUnique } from './shared/util/validator/is-unique-validator.util';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './shared/guard/access.guard';
import { PermissionGuard } from './shared/guard/permission.guard';
import { EntityModule } from './modules/entity/entity.module';
import { ObligationsModule } from './modules/obligations/obligations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    AuthModule,
    CompanyModule,
    UserModule,
    EntityModule,
    ObligationsModule,
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
