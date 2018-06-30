import { ChatPlugConfig } from './ChatPlugConfig'
import { IChatPlugMessage } from './models'
import { Subject } from 'rxjs'
import { ChatPlugService } from './services/Service'
import { ThreadConnectionsManager } from './ThreadConnectionsManager'
import { ServiceManager } from './ServiceManager'
import { ExchangeManager } from './ExchangeManager'

export class ChatPlug {
  config: ChatPlugConfig
  exchangeManager: ExchangeManager
  serviceManager = new ServiceManager()
  threadConnectionsManager: ThreadConnectionsManager
  incomingMessagePublisher: Subject<IChatPlugMessage>

  constructor() {
    this.config = new ChatPlugConfig()
    const threadConnections = this.config.getThreadConnections()
    this.threadConnectionsManager = new ThreadConnectionsManager(
      threadConnections,
    )
    this.exchangeManager = new ExchangeManager(
      this.threadConnectionsManager,
      this.serviceManager,
    )
  }

  async startBridge() {
    this.registerServices()
    await this.serviceManager.initiateServices()
  }

  async stopBridge() {
    await this.serviceManager.terminateServices()
  }

  registerServices() {
    // Get services from config/loadedServices and register then in service manager
    this.config.getLoadedServices().forEach((moduleName) => {
      const service = new (require('./services/' + moduleName) as any).default(
        this.config.getConfigForServiceName(moduleName.substr(0, moduleName.indexOf('/'))), this.exchangeManager, this.threadConnectionsManager, this.config)
      this.serviceManager.registerService(service)
    })
  }
}
