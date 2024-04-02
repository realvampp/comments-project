import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { RegisterUserDto } from './dto/register-user.dto'
import { AuthService } from './auth.service'
import { User } from './entities/user.entity'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user as User)
  }

  @UsePipes(ValidationPipe)
  @Post('register')
  register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto)
  }

  @UsePipes(ValidationPipe)
  @Post('refresh')
  async refresh(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken.refreshToken)
  }
}
