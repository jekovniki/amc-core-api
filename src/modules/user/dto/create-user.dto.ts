import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, Validate, ValidateNested } from 'class-validator';
import { IsUnique } from 'src/shared/util/validator/is-unique-validator.util';

class UserItemDto {
  @IsNotEmpty()
  @IsString()
  @Validate(IsUnique, ['user', 'email'])
  email: string;

  @IsNumber()
  @IsNotEmpty()
  role_id: number;
}

export class CreateUserDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UserItemDto)
  users: UserItemDto[];
}
