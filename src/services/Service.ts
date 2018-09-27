import { IChatPlugMessage, IChatPlugThreadResult } from '../models'
import { Subject } from 'rxjs'
import Service from '../entity/Service'
import ChatPlugContext from '../ChatPlugContext'
import Message from '../entity/Message'
import { LogLevel } from '../Logger'

export class ChatPlugService<TConfig = any> {
  config: TConfig
  receiveMessageSubject = new Subject<IChatPlugMessage>()
  dbService: Service
  context: ChatPlugContext

  constructor(dbService: Service, context: ChatPlugContext) {
    this.dbService = dbService
    this.context = context
    this.config = context.config.readConfigForService(dbService)
  }

  log(level: LogLevel, msg: string) {
    this.context.logger.log(this.dbService, level, msg)
  }

  async initialize () {}

  async terminate () {}

  async searchThreads(query: string): Promise<IChatPlugThreadResult[]> { return [] }
}
