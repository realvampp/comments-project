import { Socket } from 'socket.io'
import { User } from '../auth/entities/user.entity'
import { JwtPayload } from 'jsonwebtoken'

export type OrderFor = 'username' | 'email' | 'createdAt'
export type OrderBy = 'ASC' | 'DESC'

export type SocketIoMiddleware = (client: Client, next: (err?: any) => void) => void
export type Client = Socket & { payload: JwtPayload }