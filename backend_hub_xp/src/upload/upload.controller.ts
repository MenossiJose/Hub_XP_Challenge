import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // Limite de 5 MB
          new FileTypeValidator({ fileType: /\/(jpeg|png|gif)$/ }), // Aceita JPEG, PNG ou GIF
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('Nenhum arquivo enviado', HttpStatus.BAD_REQUEST);
    }
    // Gera um nome único para evitar colisões
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    const fileUrl = await this.uploadService.upload(
      uniqueFileName,
      file.buffer,
      file.mimetype,
    );
    return { url: fileUrl };
  }
}
