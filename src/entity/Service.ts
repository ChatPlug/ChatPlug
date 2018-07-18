import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

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
}
