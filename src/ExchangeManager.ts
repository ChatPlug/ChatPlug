import { Subject } from 'rxjs'
import ChatPlugContext from './ChatPlugContext'
import Attachment from './entity/Attachment'
import Message from './entity/Message'
import Service from './entity/Service'
import Thread from './entity/Thread'
import ThreadConnection from './entity/ThreadConnection'
import User from './entity/User'
import { IChatPlugMessage } from './models'
import * as JSON from 'circular-json'

export class ExchangeManager {
  context: ChatPlugContext
  messageSubject = new Subject<IChatPlugMessage>()
  notificationSubject = new Subject<IChatPlugMessage>()

  constructor(context: ChatPlugContext) {
    this.context = context
    const threadRepository = context.connection.getRepository(Thread)
    this.messageSubject.subscribe({
      next: async message => {
        const threads = await threadRepository
          .createQueryBuilder('thread')
          .innerJoinAndSelect('thread.threadConnection', 'threadConnection')
          .leftJoinAndSelect('threadConnection.threads', 'threads')
          .leftJoinAndSelect('threads.service', 'service')
          .where('thread.deleted = false')
          .andWhere('thread.externalServiceId = :id', {
            id: message.externalOriginId,
          })
          .getMany()

        const handledThreadConn: number[] = []
        let dbMessage: Message | null = null

        for (const thread of threads) {
          for (const actualThread of thread.threadConnection.threads.filter(
            element =>
              !element.deleted &&
              element.externalServiceId !== message.externalOriginId,
          )) {
            message.externalTargetId = actualThread.externalServiceId
            const serviceInstance = context.serviceManager.getServiceForId(
              actualThread.service.id,
            )
            if (serviceInstance) {
              const dbService = await this.context.connection
                .getRepository(Service)
                .findOneOrFail({ id: actualThread.service.id })

              if (
                handledThreadConn.filter(
                  el => el === thread.threadConnection.id,
                ).length === 0
              ) {
                handledThreadConn.push(thread.threadConnection.id)
                dbMessage = await this.saveMessageForThreadConnection(
                  message,
                  thread.threadConnection,
                )
              }

              if (dbService.enabled && dbService.status === 'running') {
                (message as any).threadConnectionId =
                  thread.threadConnection.id
                const toSend = JSON.parse(
                  JSON.stringify({
                    message: (dbMessage!!),
                    targetThread: actualThread,
                  }),
                )
                toSend.message.attachements = toSend.message.attachements || []

                serviceInstance.receiveMessageSubject.next(toSend)
              } else {
                this.context.coreLogger.debug(
                  'Instance ' +
                  dbService.instanceName +
                  ' of service ' +
                  dbService.moduleName +
                  ' disabled, or not running ignoring.',
                )
              }
            }
          }
        }

        await this.passToPrimaryServices(message)
      },
    })
  }

  private async passToPrimaryServices(message: IChatPlugMessage) {
    // Pass the message to valid `primary mode` services
    const primaryServices = await this.context.connection
      .getRepository(Service)
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.threads', 'threads')
      .leftJoinAndSelect('threads.threadConnection', 'threadConnection')
      .leftJoinAndSelect('threadConnection.threads', 'threads2')
      .where('service.primaryMode = :id', { id: true })
      .getMany()

    for (const service of primaryServices) {
      const conns = [
        ...(new Set(service.threads.map(el => el.threadConnection)) as any),
      ].filter(
        el =>
          el &&
          el.threads.some(
            el =>
              !el.deleted && el.externalServiceId === message.externalOriginId,
          ),
      )
      if (conns.length > 0) {
      } else {
        const conn = new ThreadConnection()
        const connRepo = this.context.connection.getRepository(ThreadConnection)
        conn.connectionName =
          message.externalOriginName || message.externalOriginId
        conn.threads = []
        conn.messages = []
        await connRepo.save(conn)

        const originThread = new Thread()
        originThread.title =
          message.externalOriginName || message.externalOriginId
        originThread.avatarUrl =
          'https://pbs.twimg.com/profile_images/1047758884780294144/_-wbVBfz_400x400.jpg'
        originThread.externalServiceId = message.externalOriginId
        originThread.subtitle = ''
        originThread.service = await this.context.connection
          .getRepository(Service)
          .findOneOrFail({ id: message.originServiceId!! })
        originThread.threadConnection = conn

        const targetThread = new Thread()
        targetThread.title = 'Primary connected'
        targetThread.avatarUrl =
          'https://pbs.twimg.com/profile_images/1047758884780294144/_-wbVBfz_400x400.jpg'
        targetThread.externalServiceId = '' + conn.id
        targetThread.subtitle = ''
        targetThread.service = await this.context.connection
          .getRepository(Service)
          .findOneOrFail({ id: service.id })
        targetThread.threadConnection = conn

        conn.threads.push(originThread)
        conn.threads.push(targetThread)
        await connRepo.save(conn)

        const msg = await this.saveMessageForThreadConnection(
          message,
          originThread.threadConnection,
        )

        message.externalOriginId = targetThread.externalServiceId
        const serviceInstance = this.context.serviceManager.getServiceForId(
          service!!.id,
        )
        if (serviceInstance) {
          const dbService = await this.context.connection
            .getRepository(Service)
            .findOneOrFail({ id: service.id })
          if (dbService.enabled && dbService.status === 'running') {
            ; (message as any).threadConnectionId = conn.id
            const toSend = JSON.parse(
              JSON.stringify({ targetThread, message: (msg) }),
            )
            toSend.message.attachements = toSend.message.attachements || []

            serviceInstance.receiveMessageSubject.next(toSend)
          } else {
            this.context.coreLogger.debug(
              'Instance ' +
              dbService.instanceName +
              ' of service ' +
              dbService.moduleName +
              ' disabled, or not running ignoring.',
            )
          }
        }
      }
    }
  }

  private async saveMessageForThreadConnection(
    message: IChatPlugMessage,
    thread: ThreadConnection,
  ): Promise<Message> {
    const conn = this.context.connection
    const attachementsRepository = conn.getRepository(Attachment)
    const userRepository = conn.getRepository(User)
    const messageRepository = conn.getRepository(Message)

    const service = await this.context.connection
      .getRepository(Service)
      .findOneOrFail({ id: message.originServiceId!! })

    const dbMessage = new Message()
    dbMessage.content = message.message
    dbMessage.service = service
    dbMessage.threadConnection = thread
    if (!dbMessage.content) {
      dbMessage.content = ''
    }
    dbMessage.originExternalThreadId = message.externalOriginId

    let user = await userRepository.findOne({
      externalServiceId: message.author.externalServiceId,
    })
    if (!user) {
      user = new User()
      user.avatarUrl =
        message.author.avatar ||
        'https://yt3.ggpht.com/a-/ACSszfECDj6uDQ7CRDzDJtWeYA-fbDPghCkL_jITzg=s900-mo-c-c0xffffffff-rj-k-no'
      user.username = message.author.username
      user.externalServiceId = message.author.externalServiceId
      user.service = service
      userRepository.save(user)
    }

    dbMessage.author = user

    const msgAttachments = [] as Attachment[]
    for (const attachment of message.attachments) {
      const dbAttachement = new Attachment()
      dbAttachement.message = dbMessage
      dbAttachement.name = attachment.name
      dbAttachement.url = attachment.url
      msgAttachments.push(dbAttachement)
      attachementsRepository.save(dbAttachement)
    }

    dbMessage.attachements = msgAttachments
    await messageRepository.save(dbMessage)
    return dbMessage
  }
}
