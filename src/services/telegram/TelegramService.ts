import log from 'npmlog'
import TelegramBot from 'node-telegram-bot-api'
import { IChatPlugMessage, IChatPlugAttachement } from '../../models'
import { ChatPlugService } from '../Service'
import { Subject } from 'rxjs'
import { TelegramConfig } from './TelegramConfig'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import { TelegramMessageHandler } from './TelegramMessageHandler'
import { ChatPlugConfig } from '../../ChatPlugConfig'

export default class TelegramService implements ChatPlugService {
  isEnabled: boolean
  name = 'telegram'
  messageHandler: TelegramMessageHandler
  messageSubject: Subject<IChatPlugMessage>
  receiveMessageSubject: Subject<IChatPlugMessage> = new Subject()
  config: TelegramConfig
  botClient: TelegramBot

  constructor(config: TelegramConfig, exchangeManager: ExchangeManager,  threadConnectionsManager: ThreadConnectionsManager, facegramConfig: ChatPlugConfig) {
    this.messageSubject = exchangeManager.messageSubject
    this.config = config
    this.isEnabled = config.enabled
    this.botClient = new TelegramBot(this.config.botToken, { polling: true })
  }

  async initialize() {
    this.messageHandler = new TelegramMessageHandler(this.botClient, this.messageSubject)

    this.receiveMessageSubject.subscribe(this.messageHandler.onIncomingMessage)

    this.botClient.on('message', async (msg: TelegramBot.Message) => {
      this.messageHandler.onOutgoingMessage(msg)
    })
    log.info('telegram', 'Registered bot handlers')
    const user = await this.botClient.getMe()
    console.log(user)
  }

  terminate() {
    this.botClient.stopPolling()
  }
}
