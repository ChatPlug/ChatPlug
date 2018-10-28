import fs from 'fs';
import { Subject } from 'rxjs';
import { ChatPlugConfig } from './ChatPlugConfig';
import ChatPlugContext from './ChatPlugContext';
import { IChatPlugMessage } from './models';
import { ThreadConnectionsManager } from './ThreadConnectionsManager';

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
