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

export default class ChatPlugContext {
  exchangeManager: ExchangeManager
  serviceManager: ServiceManager
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
      ],
      synchronize: true,
      logging: false,
    })
    this.exchangeManager = new ExchangeManager(this)
    this.serviceManager = new ServiceManager(this)
  }
}
