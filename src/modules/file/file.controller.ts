import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FileService } from './file.service';
import { GetPublicUrlDto } from './dto/get-public-url.dto';
import { GenerateUploadUrlDto } from './dto/generate-upload-url.dto';
import { Public } from 'src/shared/decorator/public.decorator';

@Controller({
  path: 'file',
  version: '1',
})
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Public()
  @Post()
  async generateUploadUrl(@Body() dto: GenerateUploadUrlDto) {
    return await this.fileService.generatePresignedUploadUrl(dto.fileName, dto.contentType, dto.folder);
  }

  @Public()
  @Get(':fileName')
  getPublicUrl(@Param() params: GetPublicUrlDto) {
    return this.fileService.getPublicUrl(params.fileName, params.folder);
  }
}
