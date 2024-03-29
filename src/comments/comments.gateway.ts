import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { BadRequestException, Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import { Server, Socket } from 'socket.io';
import { CommentDto } from './comment.dto'
import { CommentsService } from './comments.service'
import { OrderBy, OrderFor } from '../common/types'
import { CustomWsExceptionFilter } from '../common/CustomWsExceptionFilter'


@UseFilters(new CustomWsExceptionFilter())
@WebSocketGateway({namespace: 'comments', cors: true})
export class CommentsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private commentService: CommentsService) {
  }

  async handleConnection(client: Socket) {
    Logger.log(`Client connected: ${client.id}`)
    let comments = await this.commentService.findRoots()
    client.emit('connectionResponse', comments)
  }

// @UseGuards(WsJwtGuard)
  @UsePipes(new ValidationPipe())
  @SubscribeMessage('publishComment')
  async publishComment(@ConnectedSocket() client: Socket, @MessageBody() data: CommentDto) {
    // console.log('data:', data)
    if (!this.commentService.validateHTMLTags(data.content)) throw new BadRequestException('HTML tags is incorrect')
    try {
      return await this.commentService.create(data)
    } catch (e) {
      console.log('catch error:', e.message)
      throw new BadRequestException(e)
    }
  }

  @SubscribeMessage('giveRoots')
  async getAllComments(@ConnectedSocket() client: Socket, @MessageBody('orderFor') orderFor: OrderFor = 'createdAt', @MessageBody('orderBy') orderBy: OrderBy = 'DESC') {
    let comments = await this.commentService.findRoots(orderFor, orderBy)
    console.log('comments:', comments)
    return comments
  }

  @SubscribeMessage('giveCommentsByParent')
  async getCommentsByParent(@ConnectedSocket() client: Socket, @MessageBody('id') parentId: number) {
    return this.commentService.findByParent(parentId)
  }
}
