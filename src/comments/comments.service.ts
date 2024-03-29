import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WsException } from '@nestjs/websockets'
import { IsNull, Repository } from 'typeorm'
import { CommentDto } from './comment.dto'
import { Comment } from './comment.entity'
import { OrderBy, OrderFor } from '../common/types'

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>) {
  }

  async create(comment: CommentDto) {
    try {
      if (typeof comment.refererOn === 'number')
        comment.refererOn = await this.commentRepository.findOneBy({id: comment.refererOn})

      let createdComment = await this.commentRepository.save(comment as Comment)
      console.log('createdComment:', createdComment)
      return createdComment
    } catch (e) {
      console.log('catch error:', e.message)
      throw new BadRequestException(e)
    }
  }

  async addFile(commentId: number, fileName: string) {
    let comment = await this.commentRepository.findOneBy({id: commentId})

    if (!comment) throw new HttpException('Comment not found', 404)
    if (comment.fileName) throw new HttpException('File already added', 400)

    comment.fileName = fileName

    return await this.commentRepository.save(comment)
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
    } catch (e) {
      console.log('catch error:', e.message)
      throw new BadRequestException(e)
    }
  }

  async findByParent(parentId: number) {
    // console.log('parentId:', parentId)
    if (!parentId) throw new WsException('Id not defined')

    let parent = await this.commentRepository.findOne({where: {id: parentId}})
    // console.log('parent:', parent)

    if (!parent) throw new WsException('Parent not found')

    return this.commentRepository.find({where: {refererOn: parent}, relations: ['replies']})
  }

  validateHTMLTags(message: string): boolean {
    const htmlRegex = /<a[^>]*>.*<\/a>|<code[^>]*>.*<\/code>|<i[^>]*>.*<\/i>|<strong[^>]*>.*<\/strong>/g

    const matches = message.match(htmlRegex) || []
    const validatedMessage = matches.join('') || message

    return validatedMessage === message
  }
}