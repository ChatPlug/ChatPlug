import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import Service from './Service'

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  deleted: boolean

  @ManyToOne(type => Service, service => service.users, { cascade: ['insert', 'update'] })
  service: Service

  @Column()
  externalServiceId: string

  @Column()
  avatarUrl: string

  @Column()
  username: string
}
