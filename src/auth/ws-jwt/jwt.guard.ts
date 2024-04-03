import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { Socket } from 'socket.io'
import { JwtPayload, verify } from 'jsonwebtoken'
import { Observable } from 'rxjs'
import { getSaveEnv } from '../../common/utils'
import { Client } from '../../common/types'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') return super.canActivate(context)

    const client: Client = context.switchToWs().getClient();
    client.payload = JwtGuard.validateToken(client) as JwtPayload

    return true
  }

  static validateToken(client: Socket) {
    const {authorization} = client.handshake.headers;

    const token = authorization.split(' ')[1]
    return verify(token, getSaveEnv('JWT_ACCESS_TOKEN_SECRET'))
  }
}
