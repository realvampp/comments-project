import { Catch } from '@nestjs/common'
import { BaseWsExceptionFilter } from '@nestjs/websockets'

@Catch()
export class CustomExceptionFilter extends BaseWsExceptionFilter {

  handleUnknownError<TClient extends { emit: Function }>(exception: any, client: TClient) {
    // console.log('handleUnknownError:', exception)
    const error = exception.getResponse()
    const message = typeof error.message === 'string' ? error.message : error.message.join()

    client.emit('exception', {status: exception.status, message})
  }
}