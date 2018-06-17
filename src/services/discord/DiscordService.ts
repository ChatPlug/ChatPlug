import log from 'npmlog'
import { IFacegramMessage } from '../../models'
import { FacegramService } from '../Service'
import { Subject } from 'rxjs'
import { DiscordConfig } from './DiscordConfig'
import { Client as DiscordClient } from 'discord.js'
import { ExchangeManager } from '../../ExchangeManager'

export class DiscordService implements FacegramService {
  isEnabled: boolean
  name = 'discord'
  messageSubject = Subject.create()
  receiveMessageSubject: Subject<IFacegramMessage>
  config: DiscordConfig
  discord = new DiscordClient()

  constructor (config: DiscordConfig, exchangeManager: ExchangeManager) {
    this.receiveMessageSubject = exchangeManager.messageSubject
    this.config = config
    this.isEnabled = config.enabled
  }

  async initialize () {
    return this.discord.login(this.config.token).then(() => log.info('discord', 'Logged in as', this.discord.user.username))
  }
}
