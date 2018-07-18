import { ChatPlugConfig } from './ChatPlugConfig'
import { IChatPlugMessage } from './models'
import { Subject } from 'rxjs'
import IFieldOptions, { FieldType } from './configWizard/IFieldOptions'
import { ChatPlugService } from './services/Service'
import { ThreadConnectionsManager } from './ThreadConnectionsManager'
import { ServiceManager } from './ServiceManager'
import { ExchangeManager } from './ExchangeManager'
import ChatPlugContext from './ChatPlugContext'
import fs = require('fs')
import CLIConfigWizard from './configWizard/cli/CLIConfigWizard'
import Service from './entity/Service'
import CLIUtils from './configWizard/cli/CLIUtils'
import path from 'path'
import TOML from '@iarna/toml'

const CONFIG_FOLDER_PATH = path.join(__dirname, '../config')

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
    /*const wizard = new CLIConfigWizard()
    for (const moduleName of this.getDirectories(__dirname + '/services')) {
      const module = require('./services/' + moduleName).Config
      console.log(await wizard.promptForConfig(module))
    }*/
    await this.configureServices()
    // this.registerServices()
    // await this.serviceManager.initiateServices()
  }

  async configureServices() {
    const wizard = new CLIConfigWizard()
    const utils = new CLIUtils()
    const moduleNames = this.getDirectories(path.join(__dirname, 'services'))
    const configuredServices = this.getDirectories(CONFIG_FOLDER_PATH)
    const serviceRepository = this.context.connection.manager.getRepository(Service)
    for (const serviceModuleName of moduleNames) {
      const possibleService = await serviceRepository.findOne({ moduleName: serviceModuleName })

      if (!possibleService || (possibleService.configured && !configuredServices.includes(possibleService.moduleName + '.toml'))) {
        if (possibleService) {
          await serviceRepository.remove(possibleService)
        }

        const shouldEnable = await utils.askUser({
          type: FieldType.BOOLEAN,
          name: serviceModuleName,
          hint: 'Do you want to enable service?',
          defaultValue: false,
        })

        if (shouldEnable) {
          const confSchema = require('./services/' + serviceModuleName).Config
          console.log('Configuring service ' + serviceModuleName)
          const configuration = await wizard.promptForConfig(confSchema)
          fs.writeFileSync(path.join(CONFIG_FOLDER_PATH, serviceModuleName + '.toml'), TOML.stringify(configuration))
        }

        const service = new Service()
        service.configured = shouldEnable
        service.enabled = shouldEnable
        service.instanceName = serviceModuleName
        service.moduleName = serviceModuleName

        await serviceRepository.save(service)
      } else {
        console.log('Service already initialized ' + serviceModuleName)
      }
    }

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
