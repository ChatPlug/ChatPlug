import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import ThreadConnection from './ThreadConnection'
import Service from './Service'

@Entity()
export default class Thread {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => Service, service => service.threads, { eager: true, cascade: ['insert'] })
  service: Service

  @Column()
  externalServiceId: string

  @ManyToOne(type => ThreadConnection, threadConnection => threadConnection.threads, { cascade: ['insert'] })
  threadConnection: ThreadConnection
}
