import log from 'npmlog'
import { ChatPlugService } from '../Service'
import TelegramConfig from './TelegramConfig'
import Telegraf, { ContextMessageUpdate, Telegram } from 'telegraf'
import { TelegramMessageHandler } from './TelegramMessageHandler'
import { IChatPlugThreadResult } from '../../models'
import { Client as TelegramClient } from 'tglib/node'
import { Chat } from 'telegram-typings'

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

    // Save tglib default handler which prompt input at console
    const defaultHandler = this.telegramClient.callbacks['td:getInput']

    // Register own callback for returning auth details
    this.telegramClient.registerCallback('td:getInput', async (args) => {
      if (args.string === 'tglib.input.AuthorizationType') {
        return 'user'
      }

      if (args.string === 'tglib.input.AuthorizationValue') {
        return this.config.phoneNumber
      }
      return await defaultHandler(args)
    })

    await this.telegramClient.ready

    log.info('telegram', 'Registered bot handlers')
    this.telegraf.startPolling()

  }

  async terminate() {
    await this.telegraf.stop()
  }

  async searchThreads(query: string): Promise<IChatPlugThreadResult[]> {
    const result = await this.telegramClient.fetch({
      query,
      '@type': 'searchChatsOnServer',
      limit: 30,
    })

    const promises = result.chat_ids.map((el) => {
      return this.telegramClient.fetch({
        '@type': 'getChat',
        chat_id: el,
      })
    })

    const res = (await Promise.all(promises)).map((el: Chat) => {
      return {
        subtitle: el.type['@type'],
        id: `${el.id}`,
        title: el.title,
      } as IChatPlugThreadResult
    })
    return res
  }
}
