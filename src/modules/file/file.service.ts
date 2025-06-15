import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  private r2Client: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.configService = configService;
    this.bucketName = configService.getOrThrow('FILE_BUCKET_NAME');

    this.r2Client = new S3Client({
      region: 'auto',
      endpoint: configService.getOrThrow('FILE_API'),
      credentials: {
        accessKeyId: configService.getOrThrow('R2_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow('R2_SECRET_ACCESS_KEY'),
      },
    });
  }

  async generatePresignedUploadUrl(fileName: string, contentType: string, folder?: string): Promise<string> {
    const key = `${folder ? folder + '/' : ''}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(this.r2Client, command, {
      expiresIn: Number(this.configService.getOrThrow('FILE_PRESIGNED_URL_EXPIRATION')),
    });
  }

  getPublicUrl(fileName: string): string {
    return `${this.configService.getOrThrow('FILE_API')}/${fileName}`;
  }
}
