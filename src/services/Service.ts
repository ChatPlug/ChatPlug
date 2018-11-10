import {
  IChatPlugMessage,
  IChatPlugThreadResult,
  MessagePacket,
} from '../models'
import { Subject } from 'rxjs'
import Service from '../entity/Service'
import ChatPlugContext from '../ChatPlugContext'
import Message from '../entity/Message'
import Logger, { LogLevel } from '../Logger'

export class ChatPlugService<TConfig = any> {
  config: TConfig
  receiveMessageSubject = new Subject<MessagePacket>()
  id: number
  context: ChatPlugContext
  logger: Logger
  constructor(service: Service, context: ChatPlugContext) {
    this.logger = new Logger(context, service)
    this.id = service.id
    this.context = context
    this.config = context.config.readConfigForService(service) as any
  }

  async initialize() {}

  async terminate() {}

  async searchThreads(query: string): Promise<IChatPlugThreadResult[]> {
    return []
  }
}


