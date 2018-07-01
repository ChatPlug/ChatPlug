import log from 'npmlog'
import { IChatPlugMessage } from '../../models'
import { ChatPlugService } from '../Service'
import { Subject } from 'rxjs'
import { TelegramThreadImporterConfig } from './TelegramThreadImporterConfig'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import { ChatPlugConfig } from '../../ChatPlugConfig'
import { Client } from 'tdl'

export default class TelegramThreadImporterService implements ChatPlugService {
  isEnabled: boolean
  name = 'telegramThreadImporter'
  messageSubject: Subject<IChatPlugMessage>
  receiveMessageSubject: Subject<IChatPlugMessage> = new Subject()
  config: TelegramThreadImporterConfig
  client: Client

  constructor(config: TelegramThreadImporterConfig, exchangeManager: ExchangeManager,  threadConnectionsManager: ThreadConnectionsManager, facegramConfig: ChatPlugConfig) {
    this.messageSubject = exchangeManager.messageSubject
    this.config = config
    this.isEnabled = config.enabled
    this.client = new Client({
      apiId: Number(config.apiId),
      apiHash: config.apiHash,
      loginDetails: {
        phoneNumber: config.phoneNumber,
      },
    })
  }

  async initialize() {
    await this.client.connect()

    this.receiveMessageSubject.subscribe()
    log.info('telegram', 'Registered bot handlers')
  }

  terminate() {
    this.client.destroy()
  }
}
