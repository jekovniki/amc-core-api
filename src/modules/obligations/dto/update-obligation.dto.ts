import { PartialType } from '@nestjs/mapped-types';
import { CreateObligationDto } from './create-obligation.dto';

export class UpdateObligationDto extends PartialType(CreateObligationDto) {}
