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


  @ManyToOne(() => Comment, comment => comment.replies, { nullable: true })
  @JoinColumn({ name: 'refererOnId' })
  refererOn: Comment | null

  @OneToMany(() => Comment, comment => comment.refererOn, { cascade: true })
  replies: Comment[] | null

  @Column({ nullable: true })
  fileName: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
}