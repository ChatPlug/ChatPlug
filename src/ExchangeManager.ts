import { ThreadConnectionsManager } from './ThreadConnectionsManager'
import { Subject } from 'rxjs'
import { IChatPlugMessage } from './models'
import { ChatPlugConfig } from './ChatPlugConfig'
import { ServiceManager } from './ServiceManager'
import ChatPlugContext from './ChatPlugContext'

export class ExchangeManager {
  context: ChatPlugContext
  messageSubject: Subject<IChatPlugMessage>
  notificationSubject: Subject<IChatPlugMessage>

  constructor (context: ChatPlugContext) {
    /*this.threadConnectionsManager = threadConnectionsManager
    this.serviceManager = serviceManager
    this.messageSubject = new Subject()
    this.notificationSubject = new Subject()
    this.config = config

    this.messageSubject.subscribe({
      next: (message) => {
        let handled = false
        const threads = threadConnectionsManager.getAllReceiversForThread(message.origin)
        threads.forEach((thread) => {
          message.target = thread
          serviceManager.services[thread.service].receiveMessageSubject.next(message)
          handled = true
        })

        if (!handled && config.getCoreConfig().useFallbackService) {
          serviceManager.services[config.getCoreConfig().fallbackService].receiveMessageSubject.next(message)
        }
      },
    })*/
  }
}
