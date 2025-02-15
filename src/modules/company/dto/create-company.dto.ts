import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsUnique } from 'src/shared/util/validator/is-unique-validator.util';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsUnique, ['company', 'uic'])
  uic: string;

  @IsString()
  logo: string;
}
