import { IChatPlugConnection } from '../../models'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import * as grpc from 'grpc'
import { ChatPlugConfig } from '../../ChatPlugConfig'
const PROTO_PATH = __dirname + '/../../protos/connections.proto'
import log from 'npmlog'

export class ConnectionsService {
  config: ChatPlugConfig
  exchangeManager: ExchangeManager
  threadConnectionsManager: ThreadConnectionsManager

  constructor(exchangeManager: ExchangeManager, threadConnectionsManager: ThreadConnectionsManager, facegramConfig: ChatPlugConfig) {
    this.exchangeManager = exchangeManager
    this.threadConnectionsManager = threadConnectionsManager
    this.config = facegramConfig
  }

  getConnections = (call: any, callback: any) => {
    // callback(null, { connections: this.config.getThreadConnections() })
  }

  createConnection = (call: any, callback: any) => {
    const connection = call.request as IChatPlugConnection
    // this.config.addThreadConnection(connection)
    callback(null, connection)
  }

  registerService(server: grpc.Server) {
    server.addService(grpc.load(PROTO_PATH).chatplug.ConnectionsService.service, {
      getConnections: this.getConnections,
      createConnection: this.createConnection,
    })
    log.info('grpc', 'ConnectionsService up and running...')
  }
}
