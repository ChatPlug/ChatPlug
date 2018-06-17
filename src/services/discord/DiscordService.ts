import log from 'npmlog'
import { IFacegramMessage } from '../../models'
import { FacegramService } from '../Service'
import { Subject } from 'rxjs'
import { DiscordConfig } from './DiscordConfig'
import { Client as DiscordClient, TextChannel, Collection, Webhook } from 'discord.js'
import { ExchangeManager } from '../../ExchangeManager'

export class DiscordService implements FacegramService {
  isEnabled: boolean
  name = 'discord'
  exchangeManager: ExchangeManager
  receiveMessageSubject: Subject<IFacegramMessage> = new Subject()
  config: DiscordConfig
  discord = new DiscordClient()

  constructor (config: DiscordConfig, exchangeManager: ExchangeManager) {
    this.exchangeManager = exchangeManager
    this.config = config
    this.isEnabled = config.enabled
  }

  async initialize () {
    this.receiveMessageSubject.subscribe(async message => {
      if (!message.target) return undefined

      const channel = this.discord.channels.get(message.target.id)
      if (!channel || channel.type !== 'text') return log.warn('discord', `Channel ${message.target} not found!`)

      let webhook = (await this.getAllWebhooks()).find('channelID', message.target)
      if (!webhook) webhook = await (channel as TextChannel).createWebhook(
          `Facegram ${(channel as TextChannel).name}`.substr(0, 32),
          'https://github.com/feelfreelinux/facegram/raw/master/facegram_logo.png'
        )
      webhook.send(message.message, {
        username: message.author.username,
        avatarURL: message.author.avatar
      }).then().catch(err => log.error('discord', err))
    })

    this.discord.on('message', async (message) => {
      if ((await this.getAllWebhooks()).has(message.author.id) || message.author.username === this.discord.user.username) return
      const facegramMessage = {
        message: message.content,
        attachments: [],
        author: {
          username: message.author.username,
          avatar: message.author.avatarURL,
          id: message.author.id
        },
        origin: {
          id: message.channel.id,
          service: this.name
        }
      } as IFacegramMessage

      this.exchangeManager.messageSubject.next(facegramMessage)
    })
    return this.discord.login(this.config.token).then(async () => {
      log.info('discord', 'Logged in as', this.discord.user.username)
    }).catch(err => log.error('discord', err))
  }

  terminate () {
    return this.discord.destroy()
  }

  async getAllWebhooks () : Promise<Collection<string, Webhook>> {
    // get array of collections of webhooks from all guilds
    let allWebhooks = await Promise.all(this.discord.guilds.map(guild => guild.fetchWebhooks()))
    // filter them to get only Facegram's webhooks
    allWebhooks = allWebhooks.map(webhooks => webhooks.filter(webhook => webhook.name.startsWith('Facegram')))

    return new Collection<string, Webhook>().concat(...allWebhooks)
  }
}
