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

export default class ChatPlugContext {
  exchangeManager = new ExchangeManager(this)
  serviceManager = new ServiceManager(this)
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
      ],
      synchronize: true,
      logging: false,
    })
  }
}
