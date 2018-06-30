import { ThreadConnectionsManager } from './ThreadConnectionsManager'
import { Subject } from 'rxjs'
import { IChatPlugMessage } from './models'
import { ServiceManager } from './ServiceManager'

export class ExchangeManager {
  threadConnectionsManager: ThreadConnectionsManager
  serviceManager: ServiceManager
  messageSubject: Subject<IChatPlugMessage>
  notificationSubject: Subject<IChatPlugMessage>

  constructor (threadConnectionsManager: ThreadConnectionsManager, serviceManager: ServiceManager) {
    this.threadConnectionsManager = threadConnectionsManager
    this.serviceManager = serviceManager
    this.messageSubject = new Subject()
    this.notificationSubject = new Subject()

    this.messageSubject.subscribe({
      next: (message) => {
        const threads = threadConnectionsManager.getAllReceiversForThread(message.origin)
        threads.forEach((thread) => {
          message.target = thread
          serviceManager.services[thread.service].receiveMessageSubject.next(message)
        })
      },
    })
  }
}
