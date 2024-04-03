import { JwtGuard } from './jwt.guard'
import { SocketIoMiddleware } from '../../common/types'
import { JwtPayload } from 'jsonwebtoken'

export const socketAuthMiddleware: SocketIoMiddleware = (client, next) => {
  try {
    JwtGuard.validateToken(client)
    next()
  } catch (err) {
    next(err)
  }
}