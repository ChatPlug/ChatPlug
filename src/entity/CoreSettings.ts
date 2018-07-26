import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

@Entity()
export default class CoreSettings {
  @PrimaryGeneratedColumn()
  id: number
}
