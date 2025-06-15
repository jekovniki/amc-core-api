import { IsIn, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class GenerateUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message: 'fileName must contain only alphanumeric characters, dots, hyphens, and underscores',
  })
  fileName: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'], {
    message: 'contentType must be a valid MIME type for allowed file formats',
  })
  contentType: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'folder must contain only alphanumeric characters, hyphens, and underscores',
  })
  @Transform(({ value }) => value?.trim())
  folder?: string;
}
