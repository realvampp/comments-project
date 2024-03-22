import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Comment{
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  homepage: string

  @Column()
  content: string


  @ManyToOne(type => Comment, comment => comment.replies, { nullable: true })
  @JoinColumn({ name: 'refererOnId' })
  refererOn: Comment | null

  @OneToMany(type => Comment, comment => comment.refererOn, { cascade: true })
  replies: Comment[] | null

  @Column({ nullable: true })
  imageURl: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
}