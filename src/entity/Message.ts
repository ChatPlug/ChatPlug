import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from 'typeorm'
import Attachment from './Attachment'
import ThreadConnection from './ThreadConnection'
import User from './User'

@Entity()
export default class Message {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @ManyToOne(type => User)
  author: User

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  @OneToMany(type => Attachment, attachment => attachment.message, { eager: true, cascade: ['insert', 'remove', 'update'] })
  attachements: Attachment[]

  @ManyToOne(type => ThreadConnection, thread => thread.messages, { cascade: ['insert', 'update'] })
  threadConnection: ThreadConnection

  @Column()
  originExternalThreadId: string
}
