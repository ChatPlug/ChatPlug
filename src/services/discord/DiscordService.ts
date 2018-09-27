import log from 'npmlog'
import { IChatPlugMessage, IChatPlugThreadResult } from '../../models'
import { ChatPlugService } from '../Service'
import { Subject } from 'rxjs'
import DiscordConfig from './DiscordConfig'
import {
  Client as DiscordClient,
  Collection,
  Webhook,
} from 'discord.js'
import { DiscordMessageHandler } from './DiscordMessageHandler'
import { LogLevel } from '../../Logger'

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

    // filter them to get only ChatPlug's webhooks
    const filteredWebhooks = allWebhooks.map(webhooks =>
      webhooks.filter(webhook => webhook.name.startsWith('ChatPlug')),
    )
    // save them to a new collection
    let webhooks = new Collection() as Collection<string, Webhook>
    webhooks = webhooks.concat(...filteredWebhooks)
    this.log(LogLevel.DEBUG, 'discord: webhooks ' + webhooks.map((el) => el.name).join(','))

    this.messageHandler.loadWebhooks(webhooks)
    this.log(LogLevel.INFO, 'Logged in as ' + this.discord.user.username)
  }

  terminate() {
    return this.discord.destroy()
  }

  discordChannelToTitle = (channel) => {
    let title = channel.guild.name

    if (channel.parent) {
      title += ': ' + channel.parent.name
    }

    return title
  }

  async searchThreads(query: string): Promise<IChatPlugThreadResult[]> {
    return this.discord.channels
    .filter(b => (
      this.discordChannelToTitle(b)
        .toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        ('#' + (b as any).name)
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1) &&  b.type !== 'voice' && b.type !== 'category')
    .map(channel => {

      const subtitle = this.discordChannelToTitle(channel)

      return {
        subtitle,
        id: channel.id,
        title: '#' + ((channel as any).name),
        avatarUrl: (channel as any).guild.iconURL,
      } as IChatPlugThreadResult
    })
  }
}
