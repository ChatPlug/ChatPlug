import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

@Entity()
export default class CoreSettings {
  @PrimaryGeneratedColumn()
  id: number

  @Column('simple-array')
  disabledServices: string[]

  @Column('simple-array')
  configuredServices: string[]
}
