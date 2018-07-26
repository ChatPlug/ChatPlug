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
  threadConnectionsManager: ThreadConnectionsManager
  incomingMessagePublisher: Subject<IChatPlugMessage>

  constructor(context: ChatPlugContext) {
    this.config = new ChatPlugConfig()
    this.context = context
  }

  async startBridge() {
    await this.configureServices()
    await this.context.serviceManager.loadServices()
    await this.context.serviceManager.initiateServices()
  }

  async configureServices() {
    const wizard = new CLIConfigWizard()
    const utils = new CLIUtils()
    const moduleNames = this.getDirectories(path.join(__dirname, 'services'))
    const configuredServices = this.getFiles(CONFIG_FOLDER_PATH)
    const serviceRepository = this.context.connection.manager.getRepository(Service)
    for (const serviceModuleName of moduleNames) {
      const possibleService = await serviceRepository.findOne({ moduleName: serviceModuleName })

      if (!possibleService || (possibleService.configured && !configuredServices.includes(possibleService.moduleName + '.' + possibleService.instanceName + '.toml'))) {
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
          fs.writeFileSync(path.join(CONFIG_FOLDER_PATH, serviceModuleName + '.' + serviceModuleName + '.toml'), TOML.stringify(configuration))
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
    await this.context.serviceManager.terminateServices()
  }

  getDirectories(path) {
    return fs.readdirSync(path).filter((file) => {
      return fs.statSync(path + '/' + file).isDirectory()
    })
  }

  getFiles(path) {
    return fs.readdirSync(path).filter((file) => {
      return fs.statSync(path + '/' + file).isFile()
    })
  }
}
