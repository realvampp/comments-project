import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { CommentDto } from './comment.dto'
import { Comment } from './comment.entity'
import { OrderBy, OrderFor } from '../common/types'
import { WsException } from '@nestjs/websockets'

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>) {
  }


  async create(comment: CommentDto) {
    comment.refererOn = await this.commentRepository.findOneBy({id: comment.refererOn as number})

    let createdComment = await this.commentRepository.save(comment as Comment)
    console.log('createdComment:', createdComment)
    return createdComment
  }

  async findRoots(orderFor: OrderFor = 'createdAt', orderBy: OrderBy = 'DESC') {
    try {
      return await this.commentRepository.find({
        relations: ['replies'],
        where: {
          refererOn: IsNull()
        },
        order: {
          [orderFor]: orderBy
        },
        take: 25
      })
    }
    catch (e) {
      console.log('catch error:', e.message)
      throw new BadRequestException(e)
    }
  }

  async findByParent(parentId: number) {
    console.log('parentId:', parentId)
    if (!parentId) throw new WsException('Id not defined')

    let parent = await this.commentRepository.findOne({where: {id: parentId}})
    console.log('parent:', parent)

    if (!parent) throw new WsException('Parent not found')

    return this.commentRepository.find({where: {refererOn: parent}, relations: ['replies']})
  }
}