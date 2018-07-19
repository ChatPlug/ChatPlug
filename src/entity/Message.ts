import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import Attachment from './Attachment'
import ThreadConnection from './ThreadConnection'

@Entity()
export default class Message {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @OneToMany(type => Attachment, attachment => attachment.message, { eager: true })
  attachements: Attachment[]

  @ManyToOne(type => ThreadConnection, thread => thread.messages)
  threadConnection: ThreadConnection
}
