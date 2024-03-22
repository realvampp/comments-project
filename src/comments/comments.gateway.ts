import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import { Server, Socket } from 'socket.io';
import { CommentDto } from './comment.dto'
import { CommentsService } from './comments.service'
import { OrderBy, OrderFor } from '../common/types'
import { CustomWsExceptionFilter } from '../common/CustomWsExceptionFilter'


@UseFilters(new CustomWsExceptionFilter())
@WebSocketGateway({namespace: 'comments'})
export class CommentsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private commentService: CommentsService) {}

  async handleConnection (client: Socket) {
    Logger.log(`Client connected: ${client.id}`)
    let comments = await this.commentService.findRoots()
    client.emit('connectionResponse', comments)
  }


  @UsePipes(new ValidationPipe())
  @SubscribeMessage('publishComment')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: CommentDto) {
    console.log('data:', data)
    return this.commentService.create(data)
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
