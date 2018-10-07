import { ChatPlugMessageHandler } from '../MessageHandler'
import { IChatPlugMessage, MessagePacket } from '../../models'
import { promisify } from 'util'
import { Subject } from 'rxjs'
import { parse } from 'url'
import log from 'npmlog'
import { Collection } from 'discord.js'

export class FacebookMessageHandler implements ChatPlugMessageHandler {
  client: any
  messageSubject: Subject<IChatPlugMessage>
  name = 'facebook'
  handledMessages: any[] = []
  threadCache = new Collection<String, any>()
  userCache = new Collection<String, any>()

  constructor(client, subject: Subject<IChatPlugMessage>) {
    this.client = client
    this.messageSubject = subject
  }

  async onOutgoingMessage(message) {
    // Duplicates handling
    // if (this.handledMessages.includes(message.id)) return log.verbose('facebook', 'Possible duplicate message, ignoring')
    if (this.handledMessages.length > 100) this.handledMessages.splice(100)
    this.handledMessages.push(message.id)

    // TODO: add logging to this part of the script
    if (!this.threadCache.has(message.threadId)) {
      this.threadCache.set(message.threadId, await this.client.getThreadInfo(message.threadId))
    }

    if (!this.userCache.has(message.authorId)) {
      this.userCache.set(message.authorId, await this.client.getUserInfo(message.authorId))
    }

    const sender = this.userCache.get(message.authorId)
    const thread = this.threadCache.get(message.threadId)

    let threadName = sender.name

    if (thread.isGroup) {
      threadName = thread.name
    }

    const chatPlugMessage = {
      message: message.message,
      author: {
        username: 'Dupa',
        avatar: `https://graph.facebook.com/${message.authorId}/picture?width=128`,
        externalServiceId: message.authorId.toFixed(),
      },
      externalOriginId: thread.id.toFixed(),
    } as IChatPlugMessage

    chatPlugMessage.attachments = []
    this.messageSubject.next(chatPlugMessage)
  }

  onIncomingMessage = async (message: MessagePacket) => {
    if (!message.targetThread.externalServiceId) return
    console.log(Number(message.targetThread.externalServiceId))
    this.client.sendMessage(Number(message.targetThread.externalServiceId), `*${message.message.author.username}*: ${message.message.content}`)
  }

  setClient(client) {
    this.client = client
  }
}

function getStreamFromURL(url) {
  return new Promise((resolve, reject) => require('https').get(url, res => resolve(res)))
}
