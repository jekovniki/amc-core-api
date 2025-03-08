import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEntityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  uic: string;

  @IsOptional()
  @IsString()
  lei: string;

  @IsNumber()
  entityTypeId: number;
}
