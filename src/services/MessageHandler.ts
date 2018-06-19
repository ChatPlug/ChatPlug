import { IFacegramMessage } from '../models'
import { Subject } from 'rxjs'

export interface FacegramMessageHandler {
  client: any
  messageSubject: Subject<IFacegramMessage>

  onOutgoingMessage(message: any)

  onIncomingMessage(message: IFacegramMessage)
}
