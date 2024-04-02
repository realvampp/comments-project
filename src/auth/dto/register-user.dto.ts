import { IsEmail, IsOptional, IsString, IsUrl, MinLength } from 'class-validator'

export class RegisterUserDto {
  @IsString()
  username: string
  @IsEmail()
  email: string
  @IsUrl()
  @IsOptional()
  homepage?: string
  @IsString()
  @MinLength(6)
  password: string
}