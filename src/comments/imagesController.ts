import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { MulterConfigService } from '../config/multer-config.service'
import { CommentsService } from './comments.service'

@Controller('api/images')
export class ImagesController {
  constructor(private multerConfigService: MulterConfigService, private commentService: CommentsService) {
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Body('commentId') commentId: string, @UploadedFile() file: Express.Multer.File) {
    if (!commentId || !file) throw new BadRequestException('commentId or file not defined')
    let fileName = await this.multerConfigService.savingFile(file)
    await this.commentService.addFile(Number(commentId), fileName)

    return { fileName }
  }
}
