import log from 'npmlog'
import { IChatPlugMessage, IChatPlugAttachement } from '../../models'
import { ChatPlugService } from '../Service'
import { Subject } from 'rxjs'
import TelegramConfig from './TelegramConfig'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import Telegraf, { ContextMessageUpdate, Telegram } from 'telegraf'
import { TelegramMessageHandler } from './TelegramMessageHandler'
import { ChatPlugConfig } from '../../ChatPlugConfig'
import Message from '../../entity/Message'

export default class TelegramService extends ChatPlugService<TelegramConfig> {
  messageHandler: TelegramMessageHandler
  config: TelegramConfig
  telegraf: Telegraf<ContextMessageUpdate>

  async initialize() {
    this.telegraf = new Telegraf(this.config.botToken)

    this.messageHandler = new TelegramMessageHandler(this.telegraf.telegram, this.context.exchangeManager.messageSubject, this.context)

    this.receiveMessageSubject.subscribe(this.messageHandler.onIncomingMessage)

    this.telegraf.on('message', async (ctx: ContextMessageUpdate) => {
      this.messageHandler.onOutgoingMessage(ctx.message!!)
    })

    log.info('telegram', 'Registered bot handlers')
    this.telegraf.startPolling()
    /*const user = await this.botClient.getMe()
    console.log(user)*/
  }

  async terminate() {
    await this.telegraf.stop()
  }
}
