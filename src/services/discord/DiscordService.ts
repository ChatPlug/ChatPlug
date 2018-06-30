import log from 'npmlog'
import { IChatPlugMessage } from '../../models'
import { ChatPlugService } from '../Service'
import { Subject } from 'rxjs'
import { DiscordConfig } from './DiscordConfig'
import {
  Client as DiscordClient,
  TextChannel,
  Collection,
  Webhook,
} from 'discord.js'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import { DiscordMessageHandler } from './DiscordMessageHandler'
import { FacebookConfig } from '../facebook/FacebookConfig'

export default class DiscordService implements ChatPlugService {
  isEnabled: boolean
  name = 'discord'
  exchangeManager: ExchangeManager
  receiveMessageSubject: Subject<IChatPlugMessage> = new Subject()
  config: DiscordConfig
  messageHandler: DiscordMessageHandler
  discord = new DiscordClient()

  constructor(config: DiscordConfig, exchangeManager: ExchangeManager, threadConnectionsManager: ThreadConnectionsManager, facegramConfig: FacebookConfig) {
    this.exchangeManager = exchangeManager
    this.config = config
    this.isEnabled = config.enabled
  }

  async initialize() {
    this.messageHandler = new DiscordMessageHandler(this.discord, this.exchangeManager.messageSubject)

    this.receiveMessageSubject.subscribe(this.messageHandler.onIncomingMessage)

    this.discord.on('message', this.messageHandler.onOutgoingMessage)
    return this.discord
      .login(this.config.token)
      .then(async () => {
        // get array of collections of webhooks from all guilds
        Promise.all(this.discord.guilds.map(guild => guild.fetchWebhooks()))
          .then((allWebhooks) => {
            // filter them to get only Facegram's webhooks
            const filteredWebhooks = allWebhooks.map(webhooks =>
              webhooks.filter(webhook => webhook.name.startsWith('Facegram')),
            )
            // save them to a new collection
            let webhooks = new Collection() as Collection<string, Webhook>
            webhooks = webhooks.concat(...filteredWebhooks)
            log.silly('discord: webhooks', '%o', webhooks)

            this.messageHandler.loadWebhooks(webhooks)
          })
          .catch(err => log.error('discord', err))
        log.info('discord', 'Logged in as', this.discord.user.username)
      })
      .catch(err => log.error('discord', err))
  }

  terminate() {
    return this.discord.destroy()
  }
}
