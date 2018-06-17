import log from 'npmlog'
import { IFacegramMessage } from '../../models'
import { FacegramService } from '../Service'
import { Subject } from 'rxjs'
import { DiscordConfig } from './DiscordConfig'
import { Client as DiscordClient, TextChannel } from 'discord.js'
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
    this.receiveMessageSubject.subscribe((message) => {
      if (message.target !== undefined) {
        const channel = this.discord.channels.get(message.target.id)
        if (channel !== undefined && channel.type === 'text') {
          (channel as TextChannel).send(message.author + ': ' + message.message).then().catch()
        }
      }
    })

    this.discord.on('message', (message) => {
      if (message.author.id !== this.discord.user.id) {
        const facegramMessage = {
          message: message.content,
          attachments: [],
          author: message.author.username,
          origin: {
            id: message.channel.id,
            service: this.name
          }
        } as IFacegramMessage

        this.exchangeManager.messageSubject.next(facegramMessage)
      }
    })
    return this.discord.login(this.config.token).then(() => log.info('discord', 'Logged in as', this.discord.user.username))
  }

  terminate () {
    return this.discord.destroy()
  }
}
