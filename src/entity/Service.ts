import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import User from './User'
import Thread from './Thread'

@Entity()
export default class Service {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  instanceName: string

  @Column()
  moduleName: string

  @Column()
  enabled: boolean

  @Column()
  configured: boolean

  @OneToMany(type => Thread, thread => thread.service, { eager: true })
  threads: Thread[]

  @OneToMany(type => User, user => user.service, { eager: true })
  users: User[]
}
