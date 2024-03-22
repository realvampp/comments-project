import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentsGateway } from './comments.gateway'
import { CommentsService } from './comments.service'
import { Comment } from "./comment.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [],
  providers: [CommentsGateway, CommentsService],
})
export class CommentsModule {}
