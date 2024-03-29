import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { CommentsGateway } from './comments.gateway'
import { CommentsService } from './comments.service'
import { Comment } from "./comment.entity"
import { ImagesController } from './imagesController';
import { MulterConfigService } from '../config/multer-config.service'

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), MulterModule.registerAsync({
    useClass: MulterConfigService
  })],
  controllers: [ImagesController],
  providers: [CommentsGateway, CommentsService, MulterConfigService],
})
export class CommentsModule {}
