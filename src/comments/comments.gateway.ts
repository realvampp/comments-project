import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { BadRequestException, Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { Server, Socket } from 'socket.io';
import { CommentDto } from './comment.dto'
import { CommentsService } from './comments.service'
import { Client, OrderBy, OrderFor } from '../common/types'
import { CustomExceptionFilter } from '../common/CustomExceptionFilter'
import { socketAuthMiddleware } from '../auth/ws-jwt/ws.mw'
import { JwtGuard } from '../auth/ws-jwt/jwt.guard'

@UseGuards(JwtGuard)
@UseFilters(new CustomExceptionFilter())
@WebSocketGateway({namespace: 'comments', cors: true})
export class CommentsGateway implements OnGatewayConnection, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private commentService: CommentsService) {
  }


  afterInit(client: Socket) {
    client.use(socketAuthMiddleware as any);
    Logger.log('Init')
  }

  async handleConnection(client: Socket) {
    Logger.log(`Client connected: ${client.id}`)
    let comments = await this.commentService.findRoots()
    client.emit('connectionResponse', comments)
  }


  @UsePipes(new ValidationPipe())
  @SubscribeMessage('publishComment')
  async publishComment(@ConnectedSocket() client: Client, @MessageBody() data: CommentDto) {
    // console.log('data:', data)
    if (!this.commentService.validateHTMLTags(data.content)) throw new BadRequestException('HTML tags is incorrect')

    let comment = await this.commentService.create(client.payload.id, data)
    this.server.emit('newComment', comment)
    return comment
  }

  @SubscribeMessage('getRoots')
  getAllComments(@ConnectedSocket() client: Client, @MessageBody('orderFor') orderFor: OrderFor = 'createdAt', @MessageBody('orderBy') orderBy: OrderBy = 'DESC') {
    return this.commentService.findRoots(orderFor, orderBy)
  }

  @SubscribeMessage('getCommentsByParent')
  async getCommentsByParent(@ConnectedSocket() client: Client, @MessageBody('id') parentId: number) {
    return this.commentService.findByParent(parentId)
  }
}
