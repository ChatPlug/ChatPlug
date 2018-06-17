import { FacegramConfig } from './FacegramConfig'
import { IFacegramMessage } from './models'
import { Subject } from 'rxjs'
import { TelegramService } from './services/telegram/TelegramService'
import { DiscordService } from './services/discord/DiscordService'
import { FacebookService } from './services/facebook/FacebookService'
import { FacegramService } from './services/Service'
import { ThreadConnectionsManager } from './ThreadConnectionsManager'
import { ServiceManager } from './ServiceManager'
import { ExchangeManager } from './ExchangeManager'

export class Facegram {
  config: FacegramConfig
  exchangeManager: ExchangeManager
  serviceManager = new ServiceManager()
  threadConnectionsManager: ThreadConnectionsManager
  incomingMessagePublisher: Subject<IFacegramMessage>

  constructor () {
    this.config = new FacegramConfig()
    this.threadConnectionsManager = new ThreadConnectionsManager(this.config.getThreadConnections())
    this.exchangeManager = new ExchangeManager(this.threadConnectionsManager, this.serviceManager)
  }

  async startBridge () {
    this.registerServices()
    await this.serviceManager.initiateServices()
  }

  registerServices () {
    this.serviceManager.registerService(new TelegramService(this.config.getConfigForServiceName('telegram'), this.exchangeManager))
    this.serviceManager.registerService(new FacebookService(this.config.getConfigForServiceName('facebook'), this.exchangeManager))
    this.serviceManager.registerService(new DiscordService(this.config.getConfigForServiceName('discord'), this.exchangeManager))
  }
}
