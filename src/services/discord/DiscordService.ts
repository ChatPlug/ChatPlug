import log from 'npmlog'
import { IChatPlugMessage } from '../../models'
import { ChatPlugService } from '../Service'
import { Subject } from 'rxjs'
import DiscordConfig from './DiscordConfig'
import {
  Client as DiscordClient,
  TextChannel,
  Collection,
  Webhook,
} from 'discord.js'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import { DiscordMessageHandler } from './DiscordMessageHandler'
import ChatPlugContext from '../../ChatPlugContext'
import Service from '../../entity/Service'

export default class DiscordService extends ChatPlugService<DiscordConfig> {
  messageHandler: DiscordMessageHandler
  discord = new DiscordClient()

  async initialize() {
    this.messageHandler = new DiscordMessageHandler(this.discord, this.context.exchangeManager.messageSubject)

    this.receiveMessageSubject.subscribe(this.messageHandler.onIncomingMessage)

    this.discord.on('message', this.messageHandler.onOutgoingMessage)

    await this.discord.login(this.config.token)

    // get array of collections of webhooks from all guilds
    const allWebhooks = await Promise.all(this.discord.guilds.map(guild => guild.fetchWebhooks()))

    // filter them to get only Facegram's webhooks
    const filteredWebhooks = allWebhooks.map(webhooks =>
      webhooks.filter(webhook => webhook.name.startsWith('Facegram')),
    )
    // save them to a new collection
    let webhooks = new Collection() as Collection<string, Webhook>
    webhooks = webhooks.concat(...filteredWebhooks)
    log.silly('discord: webhooks', '%o', webhooks)

    this.messageHandler.loadWebhooks(webhooks)

    log.info('discord', 'Logged in as', this.discord.user.username)
  }

  terminate() {
    return this.discord.destroy()
  }
}
