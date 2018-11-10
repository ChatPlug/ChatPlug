import log from 'npmlog'
import { ChatPlugService } from '../Service'
import TelegramConfig from './TelegramConfig'
import Telegraf, { ContextMessageUpdate, Telegram } from 'telegraf'
import { TelegramMessageHandler } from './TelegramMessageHandler'
import { Client as TelegramClient } from 'tdl'
import { IChatPlugThreadResult } from '../../models'
import { Chat } from 'tdl/types/tdlib'

export default class TelegramService extends ChatPlugService<TelegramConfig> {
  messageHandler: TelegramMessageHandler
  config: TelegramConfig
  telegraf: Telegraf<ContextMessageUpdate>
  telegramClient: TelegramClient

  async initialize() {
    this.telegraf = new Telegraf(this.config.botToken)

    this.messageHandler = new TelegramMessageHandler(this.telegraf.telegram, this.context.exchangeManager.messageSubject, this.context, this.id)

    this.receiveMessageSubject.subscribe(this.messageHandler.onIncomingMessage)

    this.telegraf.on('message', async (ctx: ContextMessageUpdate) => {
      this.messageHandler.onOutgoingMessage(ctx.message!!)
    })

    this.telegramClient = new TelegramClient({
      apiId: this.config.apiId,
      apiHash: this.config.apiHash,
    })

    await this.telegramClient.connect()
    await (this.telegramClient as any).login(() => ({
      phoneNumber: this.config.phoneNumber,
    }))

    log.info('telegram', 'Registered bot handlers')
    this.telegraf.startPolling()

  }

  async terminate() {
    await this.telegraf.stop()
  }

  async searchThreads(query: string): Promise<IChatPlugThreadResult[]> {
    const results = await this.telegramClient.invoke({
      query,
      _: 'searchChatsOnServer',
      limit: 30,
    })

    const promises = results.chat_ids.map((el) => {
      return this.telegramClient.invoke({
        _: 'getChat',
        chat_id: el,
      })
    }) as any

    return (await Promise.all(promises)).map((el: Chat) => {
      return {
        subtitle: el.type._,
        id: '' + el.id,
        title: el.title,
      } as IChatPlugThreadResult
    })
  }
}
