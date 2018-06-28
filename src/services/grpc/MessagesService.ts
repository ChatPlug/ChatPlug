import { IFacegramConnection } from '../../models'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import * as grpc from 'grpc'
import { FacegramConfig } from '../../FacegramConfig'
const PROTO_PATH = __dirname + '/../../protos/messages.proto'

export class MessagesService {
  config: FacegramConfig
  exchangeManager: ExchangeManager
  threadConnectionsManager: ThreadConnectionsManager

  constructor(exchangeManager: ExchangeManager, threadConnectionsManager: ThreadConnectionsManager, facegramConfig: FacegramConfig) {
    this.exchangeManager = exchangeManager
    this.threadConnectionsManager = threadConnectionsManager
    this.config = facegramConfig
  }

  sendMessage = (call: any, callback: any) => {
    const message = call.request
    this.exchangeManager.messageSubject.next(message)
    callback(null, message)
  }

  registerService(server: grpc.Server) {
    server.addService(grpc.load(PROTO_PATH).chatplug.MessagesService.service, {
      sendMessage: this.sendMessage,
    })
  }
}
