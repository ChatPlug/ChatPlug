import { Subject } from 'rxjs'
import { ChatPlugService } from './services/Service'

export interface IChatPlugMessage {
  message: string
  attachments: IChatPlugAttachement[]
  author: IChatPlugUser
  origin: IChatPlugThread
  target?: IChatPlugThread
}

export interface IChatPlugAttachement {
  type: IChatPlugAttachementType,
  url: string
  name: string
}

export enum IChatPlugAttachementType {
  VIDEO,
  GIF,
  IMAGE,
  AUDIO,
  FILE,
}

export interface IChatPlugService {
  name: string
  messageSubject: Subject<IChatPlugMessage>
}

export interface IChatPlugThread {
  id: string
  service: string
  name: string
}

export interface IChatPlugUser {
  username: string
  avatar?: string
  id?: string
}

export interface IChatPlugConnection {
  services: IChatPlugThread[]
}

export interface IChatPlugServiceConfig {
  enabled: boolean
}
