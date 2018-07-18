import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import Thread from './Thread'

@Entity()
export default class ThreadConnection {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  connectionName: string

  @OneToMany(type => Thread, thread => thread.threadConnection)
  threads: Thread[]
}
