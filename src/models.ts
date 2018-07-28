import { Subject } from 'rxjs'
import { ChatPlugService } from './services/Service'

export interface IChatPlugMessage {
  message: string
  attachments: IChatPlugAttachement[]
  author: IChatPlugUser
  externalOriginId: string
  externalTargetId: string
}

export interface IChatPlugAttachement {
  url: string
  name: string
}

export interface IChatPlugService {
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
  externalServiceId: string
}

export interface IChatPlugConnection {
  services: IChatPlugThread[]
}

export interface IChatPlugServiceConfig {
  enabled: boolean
}
