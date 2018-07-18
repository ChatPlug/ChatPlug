import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import ThreadConnection from './ThreadConnection'

@Entity()
export default class Thread {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  serviceName: string

  @Column()
  threadName: string

  @ManyToOne(type => ThreadConnection, threadConnection => threadConnection.threads)
  threadConnection: ThreadConnection
}
