import log from 'npmlog'
import TelegramBot from 'node-telegram-bot-api'
import { IChatPlugMessage, IChatPlugAttachement } from '../../models'
import { ChatPlugService } from '../Service'
import { Subject } from 'rxjs'
import TelegramConfig from './TelegramConfig'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import { TelegramMessageHandler } from './TelegramMessageHandler'
import { ChatPlugConfig } from '../../ChatPlugConfig'
import Message from '../../entity/Message'

export default class TelegramService extends ChatPlugService<TelegramConfig> {
  messageHandler: TelegramMessageHandler
  config: TelegramConfig
  botClient: TelegramBot

  async initialize() {
    /*this.botClient = new TelegramBot(this.config.botToken, { polling: true })

    this.messageHandler = new TelegramMessageHandler(this.botClient, this.context.exchangeManager.messageSubject)

    this.receiveMessageSubject.subscribe(this.messageHandler.onIncomingMessage)

    this.botClient.on('message', async (msg: TelegramBot.Message) => {
      this.messageHandler.onOutgoingMessage(msg)
    })
    log.info('telegram', 'Registered bot handlers')
    /*const user = await this.botClient.getMe()
    console.log(user)*/
  }

  async terminate() {
    await this.botClient.stopPolling()
  }
}
