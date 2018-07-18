import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import Attachment from './Attachment'

@Entity()
export default class Message {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(type => Attachment, attachment => attachment.message)
  attachements: Attachment[]
}
