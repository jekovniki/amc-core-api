import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { UserModule } from './modules/user/user.module';
import { IsUnique } from './shared/util/validator/is-unique-validator.util';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessGuard } from './shared/guard/access.guard';
import { PermissionGuard } from './shared/guard/permission.guard';
import { EntityModule } from './modules/entity/entity.module';
import { ObligationsModule } from './modules/obligations/obligations.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor';
import { EntityGuard } from './shared/guard/entity.guard';
import { FileModule } from './modules/file/file.module';

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
    WalletModule,
    FileModule,
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
    {
      provide: APP_GUARD,
      useClass: EntityGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
