import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity'
import { RegisterUserDto } from './dto/register-user.dto'
import { getSaveEnv } from '../common/utils'

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>, private readonly jwtService: JwtService) {
  }

  async register(registerDto: RegisterUserDto) {
    const exists = await this.userRepository.findOneBy({username: registerDto.username})
    if (exists) {
      throw new BadRequestException('User already exists')
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10)
    const user = await this.userRepository.save({
      ...registerDto,
      password: hashedPassword,
    })

    return this.login(user)
  }

  login(user: User) {
    const payload = {username: user.username, id: user.id}
    return {
      access_token: this.jwtService.sign({...payload}, {
        secret: getSaveEnv('JWT_ACCESS_TOKEN_SECRET'),
        audience: 'token:auth',
        expiresIn: getSaveEnv('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      }),
      refresh_token: this.jwtService.sign({...payload}, {
        secret: getSaveEnv('JWT_REFRESH_TOKEN_SECRET'),
        audience: 'token:refresh',
        expiresIn: getSaveEnv('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      }),
    }
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({username})
    if (!user) {
      throw new BadRequestException('User not found')
    }
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      throw new BadRequestException('Password does not match')
    }
    return user
  }

  async refreshToken(refreshToken: string) {
    let decoded;
    try {
      decoded = this.jwtService.verify(refreshToken, {
        secret: getSaveEnv('JWT_REFRESH_TOKEN_SECRET'),
      })
    } catch (e) {
      throw new BadRequestException('Invalid refresh token')
    }
    console.log(decoded)

    const user = await this.userRepository.findOneBy({id: decoded.id})

    if (!user) throw new BadRequestException('Invalid refresh token')

    return this.login(user)
  }

  findById(id: number) {
    return this.userRepository.findOneBy({id})
  }
}
