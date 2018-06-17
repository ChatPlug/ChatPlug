import { Subject } from 'rxjs'
import { FacegramService } from './services/Service'

export interface IFacegramMessage {
  message: string
  attachments: IFacegramAttachement[]
  author: string
  origin: IFacegramThread
  serviceConnection: IFacegramConnection
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

export interface IFacegramConnection {
  services: IFacegramThread[]
}

export interface IFacegramServiceConfig {
  enabled: boolean
}
