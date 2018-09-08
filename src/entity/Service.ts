import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import User from './User'
import Thread from './Thread'
import { IChatPlugServiceStatus } from '../models'

@Entity()
export default class Service {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  instanceName: string

  @Column()
  moduleName: string

  @Column({ default: IChatPlugServiceStatus.SHUTDOWN })
  status: string

  @Column()
  enabled: boolean

  @Column()
  configured: boolean

  @OneToMany(type => Thread, thread => thread.service, { cascade: ['insert'] })
  threads: Thread[]

  @OneToMany(type => User, user => user.service, { cascade: ['insert'] })
  users: User[]
}
