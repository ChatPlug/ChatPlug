import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm'
import ThreadConnection from './ThreadConnection'
import Service from './Service'

@Entity()
export default class Thread {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => Service, service => service.threads, { eager: true, cascade: ['insert', 'remove', 'update'] })
  service: Service

  @Column()
  externalServiceId: string

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  @ManyToOne(type => ThreadConnection, threadConnection => threadConnection.threads, { cascade: ['insert', 'remove', 'update'] })
  threadConnection: ThreadConnection
}
