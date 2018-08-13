import { IChatPlugMessage } from '../models'
import { Subject } from 'rxjs'
import Service from '../entity/Service'
import ChatPlugContext from '../ChatPlugContext'
import Message from '../entity/Message'

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

  async initialize () {}

  async terminate () {}
}
