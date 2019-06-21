import { OPEN, Server as WebsocketServer } from 'ws'
import { IChatPlugMessage } from '../../models'
import { ChatPlugService } from '../Service'
import MessagingConfig from './MessagingConfig'

export default class MessagingService extends ChatPlugService<MessagingConfig> {
  wsServer: WebsocketServer
  async initialize() {
    this.wsServer = new WebsocketServer({
      port: 2135,
    })

    this.wsServer.on('connection', client => {
      client.on('message', message => {
        try {
          const event = JSON.parse(message.toString())
          if (event.event === 'message') {
            const data = event.data
            const chatPlugMessage = {
              message: data.content!!,
              attachments: data.attachements!!.map(file => ({
                name: file.name!!,
                url: file.url!!,
              })),
              author: {
                username: data!!.author.username,
                avatar: data!!.author.avatar,
                externalServiceId: data!!.author.externalServiceId,
              },
              externalOriginId: data!!.threadId!!,
              externalOriginName: 'Primary connected',
              originServiceId: this.id,
            } as IChatPlugMessage

            this.context.exchangeManager.messageSubject.next(chatPlugMessage)
          }
        } catch (e) {
          console.log(e)
        }
      })
    })

    this.receiveMessageSubject.subscribe({
      next: message => {
        (message as any).message.threadConnection.threads = null
        if (!message.message.attachements) {
          message.message.attachements = []
        }
        this.broadcastPacket(message)
      },
    })
  }

  async terminate() {
    await this.wsServer.close()
  }

  async broadcastPacket(packet: any) {
    this.wsServer.clients.forEach(el => {
      if (el.readyState === OPEN) {
        el.send(JSON.stringify(packet))
      }
    })
  }
}
