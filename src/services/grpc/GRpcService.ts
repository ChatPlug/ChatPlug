import log from 'npmlog'
import { IChatPlugMessage } from '../../models'
import { ChatPlugService } from '../Service'
import { Subject } from 'rxjs'
import GRpcConfig from './GRpcConfig'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import { ConnectionsService } from './ConnectionsService'
import { ChatPlugConfig } from '../../ChatPlugConfig'
import { MessagesService } from './MessagesService'

export default class GRpcService extends ChatPlugService<GRpcConfig> {
  isEnabled: boolean
  name = 'grpc'

  connectionsService: ConnectionsService
  messagesService: MessagesService
  messageSubject: Subject<IChatPlugMessage>
  receiveMessageSubject: Subject<IChatPlugMessage> = new Subject()
  config: GRpcConfig

  async initialize () {
    log.info('grpc', 'GRpc api running under port ' + this.config.port)
  }

  async terminate() {
  }
}
