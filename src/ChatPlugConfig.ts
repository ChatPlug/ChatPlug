import fs = require('fs')
import log from 'npmlog'
import path from 'path'
import TOML from '@iarna/toml'
import { IChatPlugConnection } from './models'

const CONFIG_FOLDER_PATH = path.join(__dirname, '../config')

const DEFAULTS = {
  core: {
    loadedServices: [],
    useFallbackService: false,
    fallbackService: 'grpc',
    serviceConnections: [],
    logLevel: 'info',
  },
  telegram: {
    enabled: false,
    botToken: 'bot token from BotFather',
  },
  telegramThreadImporter: {
    apiId: 'account API ID',
    apiHash: 'account API hash',
    phoneNumber: 'account phone number',
  },
  facebook: {
    enabled: false,
    email: 'account email',
    password: 'account password',
    forceLogin: false,
  },
  discord: {
    enabled: false,
    token: 'discord bot token',
  },
  grpc: {
    enabled: false,
    port: 5319,
  },
}

export class ChatPlugConfig {
  tomlConfig: any
  constructor () {
    // If config folder doesn't exist, create one
    if (!fs.existsSync(CONFIG_FOLDER_PATH)) {
      fs.mkdirSync(CONFIG_FOLDER_PATH)
    }
    // Check for every config file if exists, write default if doesn't
    Object.keys(DEFAULTS).forEach(configName => {
      const configPath = path.join(CONFIG_FOLDER_PATH, configName + '.toml')
      if (!fs.existsSync(configPath)) {
        log.info('config', `Writing default ${configName} config to ${configPath}`)
        fs.writeFileSync(configPath, TOML.stringify(DEFAULTS[configName]))
      }
    })

    // Read config
    this.tomlConfig = {}
    Object.keys(DEFAULTS).forEach(service => {
      this.tomlConfig[service] = this.readConfig(service)
    })
    log.level = process.env.LOG_LEVEL || this.tomlConfig.core.logLevel || 'info'
  }

  addThreadConnection(threadConnection: IChatPlugConnection) {
    this.tomlConfig.core.serviceConnections.push(threadConnection)
    this.writeConfig(this.tomlConfig)
  }

  getConfigForServiceName (name: string) {
    return this.tomlConfig[name]
  }

  getLoadedServices(): string[] {
    return this.tomlConfig.core.loadedServices
  }

  getThreadConnections (): IChatPlugConnection[] {
    return this.tomlConfig.core.serviceConnections
  }

  writeConfig (config: any) {
    Object.entries(config).forEach(([serviceName, serviceConfig]) => {
      fs.writeFileSync(path.join(CONFIG_FOLDER_PATH, serviceName + '.toml'), TOML.stringify(serviceConfig))
    })
  }

  readConfig (name: string) {
    return TOML.parse(fs.readFileSync(path.join(CONFIG_FOLDER_PATH, name + '.toml')))
  }
}
