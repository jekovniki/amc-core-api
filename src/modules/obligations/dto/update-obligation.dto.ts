import { PartialType } from '@nestjs/mapped-types';
import { CreateObligationDto } from './create-obligation.dto';
import { ObligationStatus } from './obligation.enum';
import { IsOptional, IsString } from 'class-validator';

export class UpdateObligationDto extends PartialType(CreateObligationDto) {
  @IsOptional()
  @IsString()
  status: ObligationStatus;

  @IsOptional()
  @IsString()
  newEntityId: string;
}
