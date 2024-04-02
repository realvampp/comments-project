import { WsJwtGuard } from './ws-jwt.guard'
import { SocketIoMiddleware } from '../../common/types'
import { JwtPayload } from 'jsonwebtoken'

export const socketAuthMiddleware: SocketIoMiddleware = (client, next) => {
  try {
    WsJwtGuard.validateToken(client)
    next()
  } catch (err) {
    next(err)
  }
}