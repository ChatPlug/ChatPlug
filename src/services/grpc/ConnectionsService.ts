import { IFacegramConnection } from '../../models'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import * as grpc from 'grpc'
import { FacegramConfig } from '../../FacegramConfig'
const PROTO_PATH = __dirname + '/../../protos/connections.proto'

export class ConnectionsService {
  config: FacegramConfig
  exchangeManager: ExchangeManager
  threadConnectionsManager: ThreadConnectionsManager

  constructor(exchangeManager: ExchangeManager, threadConnectionsManager: ThreadConnectionsManager, facegramConfig: FacegramConfig) {
    this.exchangeManager = exchangeManager
    this.threadConnectionsManager = threadConnectionsManager
    this.config = facegramConfig
  }

  getConnections = (call: any, callback: any) => {
    callback(null, { connections: this.config.getThreadConnections() })
  }

  createConnection = (call: any, callback: any) => {
    const connection = call.request as IFacegramConnection
    this.config.addThreadConnection(connection)
    callback(null, connection)
  }

  registerService(server: grpc.Server) {
    server.addService(grpc.load(PROTO_PATH).chatplug.ConnectionsService.service, {
      getConnections: this.getConnections,
      createConnection: this.createConnection,
    })
  }
}
