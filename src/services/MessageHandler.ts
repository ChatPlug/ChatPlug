import { IFacegramMessage } from '../models'
import { Subject } from 'rxjs'

export interface FacegramMessageHandler {
  client: any
  messageSubject: Subject<IFacegramMessage>
  name: string

  onOutgoingMessage(message: any)

  onIncomingMessage(message: IFacegramMessage)
}
