import { ChatPlugConfig } from './ChatPlugConfig'
import { IChatPlugMessage } from './models'
import { Subject } from 'rxjs'
import { ChatPlugService } from './services/Service'
import { ThreadConnectionsManager } from './ThreadConnectionsManager'
import { ServiceManager } from './ServiceManager'
import { ExchangeManager } from './ExchangeManager'
import ChatPlugContext from './ChatPlugContext'
import fs = require('fs')
import CLIConfigWizard from './configWizard/CLIConfigWizard'

export class ChatPlug {
  config: ChatPlugConfig
  context: ChatPlugContext
  exchangeManager: ExchangeManager
  serviceManager = new ServiceManager()
  threadConnectionsManager: ThreadConnectionsManager
  incomingMessagePublisher: Subject<IChatPlugMessage>

  constructor() {
    this.config = new ChatPlugConfig()
    this.context = new ChatPlugContext()
    /*const threadConnections = this.config.getThreadConnections()
    this.threadConnectionsManager = new ThreadConnectionsManager(
      threadConnections,
    )*/
  }

  async startBridge() {
    await this.context.initializeConnection()
    const wizard = new CLIConfigWizard()
    for (const moduleName of this.getDirectories(__dirname + '/services')) {
      const module = require('./services/' + moduleName).Config
      console.log(await wizard.promptForConfig(module))
    }
    // this.registerServices()
    // await this.serviceManager.initiateServices()
  }

  async stopBridge() {
    // await this.serviceManager.terminateServices()
  }

  getDirectories(path) {
    return fs.readdirSync(path).filter((file) => {
      return fs.statSync(path + '/' + file).isDirectory()
    })
  }

  registerServices() {
    // Get services from config/loadedServices and register then in service manager
    this.config.getLoadedServices().forEach((moduleName) => {
      const service = new (require('./services/' + moduleName) as any).default(
        this.config.getConfigForServiceName(moduleName.substr(0, moduleName.indexOf('/'))), this.exchangeManager, this.threadConnectionsManager, this.config)
      this.serviceManager.registerService(service)
    })
  }

  configureService(config: any): any {
    const wizard = new CLIConfigWizard()
    return wizard.promptForConfig(config)
  }
}
