import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'
import Service from './Service'

@Entity()
export default class Log {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  deleted: boolean

  @Column()
  logLevel: string

  @Column()
  message: string

  @ManyToOne(type => Service, service => service.logs, {
    nullable: true,
    cascade: ['insert', 'update'],
  })
  service?: Service

  @Column()
  systemLog: boolean

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date
}
