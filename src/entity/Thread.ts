import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm'
import ThreadConnection from './ThreadConnection'
import Service from './Service'

@Entity()
export default class Thread {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  avatarUrl: string

  @ManyToOne(type => Service, service => service.threads, { eager: true, onDelete: 'CASCADE', cascade: ['insert', 'update'] })
  service: Service

  @Column({ nullable: true })
  subtitle: string

  @Column()
  externalServiceId: string

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  @ManyToOne(type => ThreadConnection, threadConnection => threadConnection.threads, { onDelete: 'CASCADE', cascade: ['insert', 'update'] })
  threadConnection: ThreadConnection
}
