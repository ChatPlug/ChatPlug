import { ExchangeManager } from './ExchangeManager'
import { ServiceManager } from './ServiceManager'
import { createConnection, Connection } from 'typeorm'
import Attachment from './entity/Attachment'
import Message from './entity/Message'
import CoreSettings from './entity/CoreSettings'
import Thread from './entity/Thread'
import ThreadConnection from './entity/ThreadConnection'
import Service from './entity/Service'
import { ChatPlugConfig } from './ChatPlugConfig'
import User from './entity/User'
import Logger from './Logger'
import Log from './entity/Log'

export default class ChatPlugContext {
  exchangeManager: ExchangeManager
  serviceManager: ServiceManager
  coreLogger: Logger
  config = new ChatPlugConfig()

  connection: Connection

  async initializeConnection() {
    this.connection = await createConnection({
      type: 'sqlite',
      database: 'chatplug.db',
      entities: [
        Attachment,
        Message,
        CoreSettings,
        Thread,
        ThreadConnection,
        Service,
        User,
        Log,
      ],
      synchronize: true,
      logging: false,
    })
    this.exchangeManager = new ExchangeManager(this)
    this.serviceManager = new ServiceManager(this)
    this.coreLogger = new Logger(this)
    this.config.context = this
  }
}
