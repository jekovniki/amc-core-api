import { Module } from '@nestjs/common';
import { ObligationsService } from './obligations.service';
import { ObligationsController } from './obligations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Obligation } from './entities/obligation.entity';
import { EntityModule } from '../entity/entity.module';

@Module({
  imports: [TypeOrmModule.forFeature([Obligation]), EntityModule],
  controllers: [ObligationsController],
  providers: [ObligationsService],
})
export class ObligationsModule {}
