import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Comment } from '../../comments/comment.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  email: string

  @Column({nullable: true})
  homepage?: string

  @Column()
  password: string

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[]
}