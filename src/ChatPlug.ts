import { ChatPlugConfig } from './ChatPlugConfig'
import { IChatPlugMessage } from './models'
import { Subject } from 'rxjs'
import { FieldType } from './configWizard/IFieldOptions'
import { ThreadConnectionsManager } from './ThreadConnectionsManager'
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
    const availableServices = await this.context.serviceManager.getAvailableServices()
    const configuredServices = this.getFiles(CONFIG_FOLDER_PATH)
    const serviceRepository = this.context.connection.manager.getRepository(
      Service,
    )
    for (const serviceModuleName of availableServices) {
      const possibleService = await serviceRepository.findOne({
        moduleName: serviceModuleName,
      })
      // possibleService && (possibleService.configured && );
      let shouldConfigureService = false
      if (!possibleService) {
        shouldConfigureService = true
      } else {
        if (possibleService.configured) {
          const serviceConfigPath =
            possibleService.moduleName +
            '.' +
            possibleService.instanceName +
            '.toml'
          if (!configuredServices.includes(serviceConfigPath)) {
            // missing configuration for a service that is has been reported as configured
            shouldConfigureService = true
          }
        } else {
          shouldConfigureService = true
        }
      }
      if (shouldConfigureService) {
        if (possibleService) {
          await serviceRepository.remove(possibleService)
        }

        const shouldEnable = await utils.askUser({
          type: FieldType.BOOLEAN,
          name: 'enable',
          hint: `Do you want to enable the ${serviceModuleName} service?`,
          defaultValue: false,
        })

        if (shouldEnable) {
          const confSchema = require('./services/' + serviceModuleName).Config
          console.log('Configuring service ' + serviceModuleName)
          const configuration = await wizard.promptForConfig(confSchema)
          fs.writeFileSync(
            path.join(
              CONFIG_FOLDER_PATH,
              serviceModuleName + '.' + serviceModuleName + '.toml',
            ),
            TOML.stringify(configuration),
          )
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
    return fs.readdirSync(path).filter(file => {
      return fs.statSync(path + '/' + file).isDirectory()
    })
  }

  getFiles(path) {
    return fs.readdirSync(path).filter(file => {
      return fs.statSync(path + '/' + file).isFile()
    })
  }
}
