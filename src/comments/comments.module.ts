import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { CommentsGateway } from './comments.gateway'
import { CommentsService } from './comments.service'
import { Comment } from "./comment.entity"
import { FilesController } from './filesController';
import { MulterConfigService } from '../config/multer-config.service'
import { User } from '../auth/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User]), MulterModule.registerAsync({
    useClass: MulterConfigService
  })],
  controllers: [FilesController],
  providers: [CommentsGateway, CommentsService, MulterConfigService],
})
export class CommentsModule {}
