import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class GetPublicUrlDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Matches(/^[a-zA-Z0-9._/-]+$/, {
    message: 'fileName must contain only valid file path characters',
  })
  fileName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'folder must contain only alphanumeric characters, hyphens, and underscores',
  })
  @Transform(({ value }) => value?.trim())
  folder?: string;
}
