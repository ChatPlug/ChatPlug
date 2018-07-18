import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

@Entity()
export default class Service {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  enabled: boolean

  @Column()
  configured: boolean
}
