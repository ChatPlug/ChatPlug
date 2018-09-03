import fs = require('fs')
import log from 'npmlog'
import path from 'path'
import TOML from '@iarna/toml'
import { IChatPlugConnection } from './models'
import Service from './entity/Service'

const CONFIG_FOLDER_PATH = path.join(__dirname, '../config')

export class ChatPlugConfig {
  tomlConfig: any
  constructor () {
    // If config folder doesn't exist, create one
    if (!fs.existsSync(CONFIG_FOLDER_PATH)) {
      fs.mkdirSync(CONFIG_FOLDER_PATH)
    }
  }

  readConfigForService (service: Service) {
    return TOML.parse(fs.readFileSync(path.join(CONFIG_FOLDER_PATH, service.moduleName + '.' + service.id + '.toml')))
  }
}
