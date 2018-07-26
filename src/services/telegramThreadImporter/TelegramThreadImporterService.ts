import log from 'npmlog'
import { IChatPlugMessage } from '../../models'
import { ChatPlugService } from '../Service'
import { Subject } from 'rxjs'
import TelegramThreadImporterConfig from './TelegramThreadImporterConfig'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import { ChatPlugConfig } from '../../ChatPlugConfig'
import { Client } from 'tdl'

export default class TelegramThreadImporterService extends ChatPlugService {
  messageSubject: Subject<IChatPlugMessage>
  receiveMessageSubject: Subject<IChatPlugMessage> = new Subject()
  config: TelegramThreadImporterConfig
  client: Client
  coreConfig: ChatPlugConfig

  async initialize() {
    this.client = new Client({
      apiId: Number(this.config.apiId),
      apiHash: this.config.apiHash,
      loginDetails: {
        phoneNumber: this.config.phoneNumber,
      },
    })

    await this.client.connect()

    this.receiveMessageSubject.subscribe(
      async (msg: IChatPlugMessage) => {
        if (msg.origin.service !== 'telegram') {
          const user = await this.client.invoke({
            _: 'getUser',
            user_id: '612705604',
          } as any)

          const result = await this.client.invoke({
            _: 'createNewBasicGroupChat',
            title: msg.origin.name,
            user_ids: ['612705604'],
          } as any) as any

          const newThread = {
            service: 'telegram',
            name: msg.origin.name,
            id: result.id.toString(),
          }

          /*this.coreConfig.addThreadConnection({
           services: [newThread, msg.origin],
          })*/

          msg.target = newThread
          this.messageSubject.next(msg)
        }
      })
    log.info('telegram', 'Registered bot handlers')
  }

  async terminate() {
    await this.client.destroy()
  }
}
