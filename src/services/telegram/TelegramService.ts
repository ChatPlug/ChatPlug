import Telegraf, { ContextMessageUpdate } from 'telegraf'
import { ChatPlugService } from '../Service'
import TelegramConfig from './TelegramConfig'
import { TelegramMessageHandler } from './TelegramMessageHandler'

export default class TelegramService extends ChatPlugService<TelegramConfig> {
  messageHandler: TelegramMessageHandler
  config: TelegramConfig
  telegraf: Telegraf<ContextMessageUpdate>

  async initialize() {
    this.telegraf = new Telegraf(this.config.botToken)

    this.messageHandler = new TelegramMessageHandler(
      this.telegraf.telegram,
      this.context.exchangeManager.messageSubject,
      this.context,
    )

    this.receiveMessageSubject.subscribe(this.messageHandler.onIncomingMessage)

    this.telegraf.on('message', async (ctx: ContextMessageUpdate) => {
      this.messageHandler.onOutgoingMessage(ctx.message!!)
    })

    this.logger.info('Registered bot handlers')
    this.telegraf.startPolling()
    /*const user = await this.botClient.getMe()
    console.log(user)*/
  }

  async terminate() {
    await this.telegraf.stop()
  }
}
