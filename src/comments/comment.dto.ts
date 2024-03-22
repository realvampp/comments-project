import { IsEmail, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'
import { Comment } from './comment.entity'

export class CommentDto{
  @IsString()
  username: string
  @IsEmail()
  email: string
  @IsUrl()
  @IsOptional()
  homepage: string
  @IsString()
  content: string
  @IsOptional()
  @IsNumber()
  refererOn: number | Comment
}