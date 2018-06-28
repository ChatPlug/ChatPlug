import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import * as grpc from 'grpc'
import { FacegramConfig } from '../../FacegramConfig'
import { Subject } from 'rxjs'
import { IFacegramMessage } from '../../models'
const PROTO_PATH = __dirname + '/../../protos/messages.proto'
import log from 'npmlog'

export class MessagesService {
  config: FacegramConfig
  messageSubject: Subject<IFacegramMessage>
  exchangeManager: ExchangeManager
  threadConnectionsManager: ThreadConnectionsManager

  constructor(exchangeManager: ExchangeManager, threadConnectionsManager: ThreadConnectionsManager, facegramConfig: FacegramConfig, messageSubject: Subject<IFacegramMessage>) {
    this.messageSubject = messageSubject
    this.exchangeManager = exchangeManager
    this.threadConnectionsManager = threadConnectionsManager
    this.config = facegramConfig
  }

  sendMessage = (call: any, callback: any) => {
    const message = call.request
    this.exchangeManager.messageSubject.next(message)
    callback(null, message)
  }

  listenMessages = (call: any, callback: any) => {
    const subscription = this.messageSubject.subscribe((message) => {
      call.write(message)
    })

    call.on('error', () => {
      subscription.unsubscribe()
    })

    call.on('end', () => {
      subscription.unsubscribe()
    })

    call.on('cancelled', () => {
      subscription.unsubscribe()
    })
  }

  registerService(server: grpc.Server) {
    server.addService(grpc.load(PROTO_PATH).chatplug.MessagesService.service, {
      sendMessage: this.sendMessage,
      listenMessages: this.listenMessages,
    })
    log.info('grpc', 'MessagesService up and running...')
  }
}
