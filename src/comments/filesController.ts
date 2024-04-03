import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { MulterConfigService } from '../config/multer-config.service'
import { JwtGuard } from '../auth/ws-jwt/jwt.guard'

@UseGuards(JwtGuard)
@Controller('api/files')
export class FilesController {
  constructor(private multerConfigService: MulterConfigService) {
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('file not defined')
    let fileName = await this.multerConfigService.savingFile(file)

    return {fileName}
  }
}
