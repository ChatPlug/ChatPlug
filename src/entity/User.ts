import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import Service from './Service'

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => Service, service => service.users, { cascade: ['insert'] })
  service: Service

  @Column()
  externalServiceId: string

  @Column()
  avatarUrl: string

  @Column()
  username: string
}
