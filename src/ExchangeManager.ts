import { ThreadConnectionsManager } from './ThreadConnectionsManager'
import { Subject } from 'rxjs'
import { IFacegramMessage } from './models'
import { ServiceManager } from './ServiceManager'

export class ExchangeManager {
  threadConnectionsManager: ThreadConnectionsManager
  serviceManager: ServiceManager
  messageSubject: Subject<IFacegramMessage>
  notificationSubject: Subject<IFacegramMessage>

  constructor (threadConnectionsManager: ThreadConnectionsManager, serviceManager: ServiceManager) {
    this.threadConnectionsManager = threadConnectionsManager
    this.serviceManager = serviceManager
    this.messageSubject = Subject.create()
    this.notificationSubject = Subject.create()

    this.messageSubject.subscribe((message) => {
      const threads = threadConnectionsManager.getAllReceiversForThread(message.origin)
      threads.forEach((thread) => {
        serviceManager.services[thread.service].messageSubject.next(message)
      })
    })
  }
}
