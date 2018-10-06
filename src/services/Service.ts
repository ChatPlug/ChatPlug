import { IChatPlugMessage, IChatPlugThreadResult } from '../models'
import { Subject } from 'rxjs'
import Service from '../entity/Service'
import ChatPlugContext from '../ChatPlugContext'
import Message from '../entity/Message'
import { LogLevel } from '../Logger'

export class ChatPlugService<TConfig = any> {
  config: TConfig
  receiveMessageSubject = new Subject<IChatPlugMessage>()
  id: number
  context: ChatPlugContext

  constructor(service: Service, context: ChatPlugContext) {
    this.id = service.id
    this.context = context
    this.config = context.config.readConfigForService(service)
  }

  async log(level: LogLevel, msg: string) {
    this.context.logger.log(await this.context.connection.getRepository(Service).findOneOrFail({ id: this.id }), level, msg)
  }

  async initialize () {}

  async terminate () {}

  async searchThreads(query: string): Promise<IChatPlugThreadResult[]> { return [] }
}
