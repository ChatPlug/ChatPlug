import { IChatPlugMessage } from '../models'
import { Subject } from 'rxjs'

export interface FacegramMessageHandler {
  messageSubject: Subject<IChatPlugMessage>
  name: string

  onOutgoingMessage(message: any)

  onIncomingMessage(message: IChatPlugMessage)
}
