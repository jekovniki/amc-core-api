import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateObligationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  dueDateAt: Date;
}
