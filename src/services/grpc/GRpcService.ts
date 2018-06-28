import log from 'npmlog'
import { IFacegramMessage, IFacegramThread } from '../../models'
import { FacegramService } from '../Service'
import { Subject } from 'rxjs'
import { GRpcConfig } from './GRpcConfig'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import * as grpc from 'grpc'

const CONNECTIONS_PROTO_PATH = __dirname + '/../../protos/connections.proto'

const connectionsProto = grpc.load(CONNECTIONS_PROTO_PATH).connections

export default class GRpcService implements FacegramService {
  isEnabled: boolean
  server: grpc.Server
  name = 'grpc'
  messageSubject: Subject<IFacegramMessage>
  receiveMessageSubject: Subject<IFacegramMessage> = new Subject()
  config: GRpcConfig

  constructor(config: GRpcConfig, exchangeManager: ExchangeManager, threadConnectionsManager: ThreadConnectionsManager) {
    this.messageSubject = exchangeManager.messageSubject
    this.config = config
    this.isEnabled = config.enabled
  }

  getConnections(call, callback) {
    console.log('getConn')
    callback(null, {})
  }

  createConnection(call, callback) {
    console.log('createConn')
    callback(null, {})
  }

  async initialize () {
    this.server = new grpc.Server
    this.server.addService(connectionsProto.ConnectionsService.service, {
      getConnections: this.getConnections,
      createConnection: this.createConnection,
    })

    this.server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
    this.server.start()
    // this.receiveMessageSubject.subscribe(this.messageHandler.onIncomingMessage)
  }

  terminate() {
  }
}
