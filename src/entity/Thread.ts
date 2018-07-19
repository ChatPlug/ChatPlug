import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import ThreadConnection from './ThreadConnection'
import Service from './Service'

@Entity()
export default class Thread {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => Service, service => service.users)
  service: Service

  @Column()
  threadName: string

  @Column()
  externalServiceId: string

  @ManyToOne(type => ThreadConnection, threadConnection => threadConnection.threads, { cascade: ['insert'] })
  @JoinColumn()
  threadConnection: ThreadConnection
}
