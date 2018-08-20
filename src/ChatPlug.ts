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
    await this.context.serviceManager.loadServices()
    await this.context.serviceManager.initiateServices()
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
