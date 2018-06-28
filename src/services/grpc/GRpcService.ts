import log from 'npmlog'
import { IFacegramMessage } from '../../models'
import { FacegramService } from '../Service'
import { Subject } from 'rxjs'
import { GRpcConfig } from './GRpcConfig'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import * as grpc from 'grpc'
import { ConnectionsService } from './ConnectionsService'
import { FacegramConfig } from '../../FacegramConfig'
import { MessagesService } from './MessagesService'

const CONNECTIONS_PROTO_PATH = __dirname + '/../../protos/connections.proto'

const connectionsProto = grpc.load(CONNECTIONS_PROTO_PATH).chatplug

export default class GRpcService implements FacegramService {
  isEnabled: boolean
  server: grpc.Server
  name = 'grpc'

  connectionsService: ConnectionsService
  messagesService: MessagesService
  messageSubject: Subject<IFacegramMessage>
  receiveMessageSubject: Subject<IFacegramMessage> = new Subject()
  config: GRpcConfig

  constructor(config: GRpcConfig, exchangeManager: ExchangeManager, threadConnectionsManager: ThreadConnectionsManager, facegramConfig: FacegramConfig) {
    this.messageSubject = exchangeManager.messageSubject
    this.config = config
    this.messagesService = new MessagesService(exchangeManager, threadConnectionsManager, facegramConfig, this.receiveMessageSubject)
    this.connectionsService = new ConnectionsService(exchangeManager, threadConnectionsManager, facegramConfig)
    this.isEnabled = config.enabled
  }

  async initialize () {
    this.server = new grpc.Server
    this.connectionsService.registerService(this.server)
    this.messagesService.registerService(this.server)

    this.server.bind('0.0.0.0:' + this.config.port, grpc.ServerCredentials.createInsecure())
    this.server.start()

    log.info('grpc', 'GRpc api running under port ' + this.config.port)
  }

  terminate() {
    this.server.forceShutdown()
  }
}
