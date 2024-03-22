import { ArgumentsHost, Catch } from '@nestjs/common'
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets'

@Catch()
export class CustomWsExceptionFilter extends BaseWsExceptionFilter {

  handleUnknownError<TClient extends { emit: Function }>(exception: any, client: TClient) {
    const error = exception.getResponse()
    const message = typeof error.message === 'string' ? error.message : error.message.join()

    client.emit('exception', { status: exception.status, message })
  }
}