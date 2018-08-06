import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import Message from './Message'

@Entity()
export default class Attachment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  url: string

  @Column()
  name: string

  @ManyToOne(type => Message, message => message.attachements, { cascade: ['insert'] })
  message: Message
}