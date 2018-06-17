import { Subject } from 'rxjs'
import { FacegramService } from './services/Service'

export interface IFacegramMessage {
  message: string
  attachments: IFacegramAttachement[]
  author: IFacegramUser
  origin: IFacegramThread
  target?: IFacegramThread
}

export interface IFacegramAttachement {
  url: string,
  name: string
}

export interface IFacegramService {
  name: string
  messageSubject: Subject<IFacegramMessage>
}

export interface IFacegramThread {
  id: string
  service: string
}

export interface IFacegramUser {
  username: string
  avatar?: string
  id?: string
}

export interface IFacegramConnection {
  services: IFacegramThread[]
}

export interface IFacegramServiceConfig {
  enabled: boolean
}
