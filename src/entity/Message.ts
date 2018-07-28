import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
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

  @OneToMany(type => Attachment, attachment => attachment.message, { eager: true, cascade: ['insert'] })
  attachements: Attachment[]

  @ManyToOne(type => ThreadConnection, thread => thread.messages, { cascade: ['insert'] })
  threadConnection: ThreadConnection

  @Column()
  originExternalThreadId: string
}
