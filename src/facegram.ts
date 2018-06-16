import { FacegramConfig } from './config'
import { IFacegramService, IFacegramMessage } from './models'
import { Subject } from 'rxjs'
import { TelegramService } from './services/telegram/telegramservice'
import { FacebookService } from './services/facebook/facebookservice'
import { DiscordService } from './services/discord/discordservice'
import { FacegramService } from './services/service'

export class Facegram {
  config: FacegramConfig
  services: Array<FacegramService>
  incomingMessagePublisher: Subject<IFacegramMessage>

  constructor () {
    this.config = new FacegramConfig()
    this.incomingMessagePublisher = Subject.create()
    this.services = []
  }

  async startBridge () {
    this.registerServices()
    await this.initiateServices()
  }

  registerServices () {
    this.services.push(new TelegramService(this.config.getConfigForServiceName('telegram'), this.incomingMessagePublisher))
    this.services.push(new FacebookService(this.config.getConfigForServiceName('facebook'), this.incomingMessagePublisher))
    this.services.push(new DiscordService(this.config.getConfigForServiceName('discord'), this.incomingMessagePublisher))
  }

  async initiateServices () {
    this.services.forEach((service) => {
      if (service.isEnabled) {
        console.log('Initializing enabled service ' + service.name)
        service.initialize()
      } else {
        console.log('Service disabled ' + service.name)
      }
    })
  }
}
