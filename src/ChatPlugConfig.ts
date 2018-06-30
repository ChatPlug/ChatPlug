import fs = require('fs')
import log from 'npmlog'
import { IChatPlugConnection } from './models'

const CONFIG_FILE_PATH = './config.json'

const DEFAULT_CONFIG = {
  loadedServices: [],
  useFallbackService: false,
  fallbackService: 'grpc',
  services: {
    telegram: {
      enabled: false,
      botToken: 'bot token from botfather',
    },

    telegramThreadImporter: {
      apiId: 'your apiId',
      apiHash: 'your api hash',
      phoneNumber: 'your telegram phone number',
    },

    facebook: {
      enabled: false,
      email: 'account email',
      password: 'account password',
      forceLogin: true,
    },

    discord: {
      enabled: false,
      token: 'discord bot token',
    },

    grpc: {
      enabled: false,
      port: 5319,
    },
  },

  serviceConnections: [],

  logLevel: 'info',
}
export class ChatPlugConfig {
  jsonConfig: any
  constructor () {
    // If config file doesn't exist, create one
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      this.writeConfig(DEFAULT_CONFIG)
      log.info('config', 'Written default config to ' + CONFIG_FILE_PATH)
      process.exit(0)
    }

    // Read config
    this.jsonConfig = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf-8'))
    if (this.jsonConfig.logLevel) log.level = this.jsonConfig.logLevel
    if (process.env.LOG_LEVEL) log.level = process.env.LOG_LEVEL
  }

  addThreadConnection(threadConnection: IChatPlugConnection) {
    this.jsonConfig.serviceConnections.push(threadConnection)
    this.writeConfig(this.jsonConfig)
  }

  getConfigForServiceName (name: string) {
    return this.jsonConfig['services'][name]
  }

  getLoadedServices(): string[] {
    return this.jsonConfig.loadedServices
  }

  getThreadConnections (): IChatPlugConnection[] {
    return this.jsonConfig['serviceConnections']
  }

  writeConfig (config: any) {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2))
  }
}
