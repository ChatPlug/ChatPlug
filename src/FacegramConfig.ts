import fs = require('fs')
import log from 'npmlog'
import { IFacegramConnection } from './models'

const CONFIG_FILE_PATH = './config.json'

const DEFAULT_CONFIG = {
  services: {
    telegram: {
      enabled: false,
      apiId: 'telegram account apiId',
      apiHash: 'telegram account apiHash',
      phoneNumber: 'telegram account phone number',
      telegramUsername: 'telegram account username',
      botToken: 'bot token from botfather'
    },

    facebook: {
      enabled: false,
      email: 'account email',
      password: 'account password',
      forceLogin: true
    },

    discord: {
      enabled: false,
      token: 'discord bot token'
    }
  },

  serviceConnections: [],

  logLevel: 'info'
}
export class FacegramConfig {
  jsonConfig: any
  constructor () {
    // If config file doesn't exist, create one
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      this.writeConfig(DEFAULT_CONFIG)
      log.info('config', 'Writted default config to ' + CONFIG_FILE_PATH)
      process.exit(0)
    }

    // Read config
    this.jsonConfig = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf-8'))
    if (this.jsonConfig.logLevel) log.level = this.jsonConfig.logLevel
    if (process.env.LOG_LEVEL) log.level = process.env.LOG_LEVEL
  }

  getConfigForServiceName (name: string) {
    return this.jsonConfig['services'][name]
  }

  getThreadConnections (): IFacegramConnection[] {
    return this.jsonConfig['serviceConnections']
  }

  writeConfig (config: any) {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2))
  }
}
