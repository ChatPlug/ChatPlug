import { Observable, Subject } from 'rxjs'

export interface IFacegramMessage {
  message: string
  attachments: { url: string, name: string }[]
  author: string
  origin: IFacegramService
  serviceConnection: IFacegramServiceConnection
}

export interface IFacegramService {
  name: string
  messageSubject: Subject<IFacegramMessage>
}

export interface IFacegramServiceConnection {
  [service: string]: string
}

export interface IFacegramServiceConfig {
  enabled: boolean
}