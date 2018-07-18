import { IChatPlugMessage } from '../models'
import { Subject } from 'rxjs'
import Service from '../entity/Service'
import ChatPlugContext from '../ChatPlugContext'

export class ChatPlugService {
  config: any
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
