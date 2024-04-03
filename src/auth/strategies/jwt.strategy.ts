import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { getSaveEnv } from '../../common/utils'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getSaveEnv('JWT_ACCESS_TOKEN_SECRET'),
    })
  }

  async validate(payload: any) {
    console.log(payload)
    return {userId: payload.id, username: payload.username}
  }
}
