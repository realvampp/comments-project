import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { CommentDto } from './comment.dto'
import { Comment } from './comment.entity'
import { OrderBy, OrderFor } from '../common/types'
import { User } from '../auth/entities/user.entity'

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>, @InjectRepository(User) private userRepository: Repository<User>) {
  }

  async create(userId: number, comment: CommentDto) {
    try {
      let user = await this.userRepository.findOneBy({id: userId})
      if (!user) throw new BadRequestException('User not found')

      if (typeof comment.refererOn === 'number')
        comment.refererOn = await this.commentRepository.findOneBy({id: comment.refererOn})

      return await this.commentRepository.save({...comment, user} as Comment)
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

    return this.commentRepository.save(comment)
  }

  async findRoots(orderFor: OrderFor = 'createdAt', orderBy: OrderBy = 'DESC') {
    try {
      return await this.commentRepository.find({
        relations: ['replies'],
        where: {
          refererOn: IsNull(),
        },
        order: {
          [orderFor]: orderBy,
        },
        take: 25,
      })
    } catch (e) {
      console.log('catch error:', e.message)
      throw new BadRequestException(e)
    }
  }

  async findByParent(parentId: number) {
    // console.log('parentId:', parentId)
    if (!parentId) throw new BadRequestException('Id not defined')

    let parent = await this.commentRepository.findOne({where: {id: parentId}})
    // console.log('parent:', parent)

    if (!parent) throw new BadRequestException('Parent not found')

    return this.commentRepository.find({where: {refererOn: parent}, relations: ['replies']})
  }

  validateHTMLTags(message: string): boolean {
    const htmlRegex = /<a[^>]*>.*<\/a>|<code[^>]*>.*<\/code>|<i[^>]*>.*<\/i>|<strong[^>]*>.*<\/strong>/g

    const matches = message.match(htmlRegex) || []
    const validatedMessage = matches.join('') || message

    return validatedMessage === message
  }
}