import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: this.configService.get<string>('AWS_ENDPOINT'),
      region: this.configService.getOrThrow<string>('AWS_DEFAULT_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      forcePathStyle: true,
    });
  }

  /**
   * Efetua o upload de um arquivo para o S3.
   *
   * @param fileName Nome do arquivo a ser armazenado no bucket.
   * @param file Buffer do arquivo.
   * @param mimetype Tipo MIME do arquivo.
   * @returns URL pública do arquivo armazenado.
   */
  async upload(
    fileName: string,
    file: Buffer,
    mimetype: string,
  ): Promise<string> {
    const bucketName = this.configService.getOrThrow<string>('AWS_BUCKET_NAME');
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: file,
          ContentType: mimetype,
        }),
      );

      // Monta a URL do arquivo considerando que o endpoint já aponta para o S3 (ou LocalStack)
      const endpoint = this.configService.get<string>('AWS_ENDPOINT');
      if (!endpoint) {
        throw new InternalServerErrorException('AWS_ENDPOINT is not defined');
      }

      // Replace localstack with localhost in the URL for browser access
      const browserAccessibleEndpoint = endpoint
        .replace(/\/$/, '')
        .replace('localstack', 'localhost');
      const fileUrl = `${browserAccessibleEndpoint}/${bucketName}/${fileName}`;

      return fileUrl;
    } catch (error) {
      this.logger.error('Erro ao enviar arquivo para o S3', error);
      throw new InternalServerErrorException(
        'Falha ao fazer upload do arquivo',
      );
    }
  }
}
