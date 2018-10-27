import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, JoinTable } from 'typeorm'
import Thread from './Thread'
import Message from './Message'

@Entity()
export default class ThreadConnection {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  deleted: boolean

  @Column()
  connectionName: string

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  @OneToMany(type => Thread, thread => thread.threadConnection, { eager: true, onDelete:'CASCADE', cascade: ['insert', 'remove', 'update'] })
  @JoinTable()
  threads: Thread[]

  @OneToMany(type => Message, message => message.threadConnection, { onDelete:'CASCADE', cascade: ['insert', 'remove', 'update'] })
  @JoinTable()
  messages: Message[]
}
