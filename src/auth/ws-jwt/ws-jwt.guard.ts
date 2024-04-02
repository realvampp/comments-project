import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io'
import { JwtPayload, verify } from 'jsonwebtoken'
import { Observable } from 'rxjs'
import { getSaveEnv } from '../../common/utils'
import { Client } from '../../common/types'

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') return true

    const client: Client = context.switchToWs().getClient() ;
    client.payload = WsJwtGuard.validateToken(client) as JwtPayload

    return true
  }

  static validateToken(client: Socket) {
    const {authorization} = client.handshake.headers;
    // console.log('Authorization: ', authorization)
    const token = authorization.split(' ')[1]
    return verify(token, getSaveEnv('JWT_ACCESS_TOKEN_SECRET'))
  }
}
