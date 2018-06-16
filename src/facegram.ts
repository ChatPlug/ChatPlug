import { FacegramConfig } from './config'
import { IFacegramService, IFacegramMessage } from './models'
import { Subject } from 'rxjs'
import { TelegramService } from './telegramservice'
import { FacebookService } from './facebookservice'
import { DiscordService } from './discordservice'

export class Facegram {
  config: FacegramConfig
  services: Array<IFacegramService>
  incomingMessagePublisher: Subject<IFacegramMessage>

  constructor () {
    this.config = new FacegramConfig()
    this.incomingMessagePublisher = Subject.create()
    this.services = []
  }

  async startBridge () {
    await this.registerServices()
  }

  async registerServices () {
    const telegram = new TelegramService(this.config.getConfigForServiceName('telegram'), this.incomingMessagePublisher)
    this.services.push(telegram)
    await telegram.initialize()

    const facebook = new FacebookService(this.config.getConfigForServiceName('facebook'), this.incomingMessagePublisher)
    this.services.push(facebook)
    await facebook.initialize()

    const discord = new DiscordService(this.config.getConfigForServiceName('discord'), this.incomingMessagePublisher)
    this.services.push(discord)
    await discord.initialize()
  }
}
