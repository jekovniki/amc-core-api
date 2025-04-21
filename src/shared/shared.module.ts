import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [DatabaseModule, MailModule],
  providers: [],
})
export class SharedModule {}
