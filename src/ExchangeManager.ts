import { ThreadConnectionsManager } from './ThreadConnectionsManager'
import { Subject } from 'rxjs'
import { IChatPlugMessage } from './models'
import { ChatPlugConfig } from './ChatPlugConfig'
import { ServiceManager } from './ServiceManager'
import ChatPlugContext from './ChatPlugContext'
import Message from './entity/Message'
import ThreadConnection from './entity/ThreadConnection'
import Thread from './entity/Thread'
import Attachment from './entity/Attachment'
import Service from './entity/Service'
import User from './entity/User'
import log from 'npmlog'

export class ExchangeManager {
  context: ChatPlugContext
  messageSubject = new Subject<IChatPlugMessage>()
  notificationSubject = new Subject<IChatPlugMessage>()

  constructor (context: ChatPlugContext) {
    this.context = context
    const threadRepository = context.connection.getRepository(Thread)
    this.messageSubject.subscribe({
      next: async (message) => {
        const threads = await threadRepository.find({
          where: { externalServiceId: message.externalOriginId },
          join: {
            alias: 'thread',
            leftJoinAndSelect: {
              threadConnection: 'thread.threadConnection',
              threads: 'threadConnection.threads',
              messages: 'threadConnection.messages',
              service: 'threads.service',
            },
          },
        })

        for (const thread of threads) {
          for (const actualThread of thread.threadConnection.threads.filter((element) => element.externalServiceId !== message.externalOriginId)) {
            message.externalTargetId = actualThread.externalServiceId
            const serviceInstance = context.serviceManager.getServiceForId('' + actualThread.service.id)
            if (serviceInstance.dbService.enabled) {
              serviceInstance.receiveMessageSubject.next(message)
            } else {
              log.verbose('exchange', 'Instance ' + serviceInstance.dbService.instanceName + ' of service ' + serviceInstance.dbService.moduleName + ' disabled, ignoring.')
            }
          }

          const conn = context.connection
          const attachementsRepository = conn.getRepository(Attachment)
          const userRepository = conn.getRepository(User)
          const threadConnectionRepository = conn.getRepository(ThreadConnection)

          const dbMessage = new Message()
          dbMessage.content = message.message
          if (!dbMessage.content) {
            dbMessage.content = ''
          }
          dbMessage.originExternalThreadId = message.externalOriginId

          let user = await userRepository.findOne({ externalServiceId: message.author.externalServiceId })
          if (!user) {
            user = new User()
            user.avatarUrl = message.author.avatar || 'https://yt3.ggpht.com/a-/ACSszfECDj6uDQ7CRDzDJtWeYA-fbDPghCkL_jITzg=s900-mo-c-c0xffffffff-rj-k-no'
            user.username = message.author.username
            user.externalServiceId = message.author.externalServiceId
            user.service = thread.service
            userRepository.save(user)
          }

          dbMessage.author = user

          for (const attachment of message.attachments) {
            const dbAttachement = new Attachment()
            dbAttachement.message = dbMessage
            dbAttachement.name = attachment.name
            dbAttachement.url = attachment.url
            attachementsRepository.save(dbAttachement)
          }

          thread.threadConnection.messages.push(dbMessage)
          // messageRepository.save(dbMessage)
          threadConnectionRepository.save(thread.threadConnection)
        }
      }})
  }
}
