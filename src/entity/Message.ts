import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, JoinTable } from 'typeorm'
import Attachment from './Attachment'
import ThreadConnection from './ThreadConnection'
import User from './User'
import Service from './Service'

@Entity()
export default class Message {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  deleted: boolean

  @Column()
  content: string

  @ManyToOne(type => User)
  author: User

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  @OneToMany(type => Attachment, attachment => attachment.message, { eager: true, cascade: ['insert', 'remove', 'update'] })
  @JoinTable()
  attachements: Attachment[]

  @ManyToOne(type => ThreadConnection, thread => thread.messages, { cascade: ['insert', 'update'] })
  threadConnection: ThreadConnection

  @ManyToOne(type => Service)
  service: Service

  @Column()
  originExternalThreadId: string
}
