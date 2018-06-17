import { FacegramConfig } from './FacegramConfig'
import { IFacegramMessage } from './models'
import { Subject } from 'rxjs'
import { TelegramService } from './services/telegram/TelegramService'
import { FacebookService } from './services/facebook/FacebookService'
import { DiscordService } from './services/discord/DiscordService'
import { FacegramService } from './services/Service'
import { ThreadConnectionsManager } from './ThreadConnectionsManager'

export class Facegram {
  config: FacegramConfig
  services: Array<FacegramService>
  threadConnectionsManager: ThreadConnectionsManager
  incomingMessagePublisher: Subject<IFacegramMessage>

  constructor () {
    this.config = new FacegramConfig()
    this.threadConnectionsManager = new ThreadConnectionsManager(this.config.getThreadConnections())
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
