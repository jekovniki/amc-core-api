import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class GetPublicUrlDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Matches(/^[a-zA-Z0-9._/-]+$/, {
    message: 'fileName must contain only valid file path characters',
  })
  fileName: string;
}
