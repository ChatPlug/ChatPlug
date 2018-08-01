import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm'
import Thread from './Thread'
import Message from './Message'

@Entity()
export default class ThreadConnection {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  connectionName: string

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  @OneToMany(type => Thread, thread => thread.threadConnection, { eager: true, cascade: ['insert'] })
  threads: Thread[]

  @OneToMany(type => Message, message => message.threadConnection, { cascade: ['insert'] })
  messages: Message[]
}
