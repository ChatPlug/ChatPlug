import { ThreadConnectionsManager } from './ThreadConnectionsManager'
import { Subject } from 'rxjs'
import { IChatPlugMessage } from './models'
import { ChatPlugConfig } from './ChatPlugConfig'
import { ServiceManager } from './ServiceManager'
import ChatPlugContext from './ChatPlugContext'
import Message from './entity/Message'

export class ExchangeManager {
  context: ChatPlugContext
  messageSubject = new Subject<Message>()
  notificationSubject = new Subject<Message>()

  constructor (context: ChatPlugContext) {
    this.context = context
    this.messageSubject.subscribe({
      next: (mssage) => {
      }})
  }
}
