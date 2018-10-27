import { IChatPlugMessage, MessagePacket } from '../models'
import { Subject } from 'rxjs'

export interface ChatPlugMessageHandler {
  messageSubject: Subject<IChatPlugMessage>

  onOutgoingMessage(message: any)

  onIncomingMessage(packet: MessagePacket)
}
