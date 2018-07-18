import { ExchangeManager } from './ExchangeManager'
import { ServiceManager } from './ServiceManager'
import { createConnection, Connection, Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import Attachment from './entity/Attachment'
import Message from './entity/Message'
import CoreSettings from './entity/CoreSettings'
import Thread from './entity/Thread'
import ThreadConnection from './entity/ThreadConnection'

export default class ChatPlugContext {
  exchangeManger = new ExchangeManager(this)
  serviceManager = new ServiceManager()
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
      ],
      synchronize: true,
      logging: false,
    })
  }
}
