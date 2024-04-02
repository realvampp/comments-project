import { IsEmail, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'
import { Comment } from './comment.entity'

export class CommentDto{
  @IsString()
  content: string
  @IsOptional()
  @IsNumber()
  refererOn: number | Comment
  @IsOptional()
  @IsString()
  fileName: string
}