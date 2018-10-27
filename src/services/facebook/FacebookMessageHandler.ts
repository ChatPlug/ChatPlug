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
    // TODO: add logging to this part of the script
    if (!this.threadCache.has(message.threadId)) {
      this.threadCache.set(message.threadId, await this.client.getThreadInfo(message.threadId))
    }

    if (!this.userCache.has(message.authorId)) {
      this.userCache.set(message.authorId, await this.client.getUserInfo(message.authorId))
    }

    const sender = this.userCache.get(message.authorId)
    const thread = this.threadCache.get(message.threadId)

    let originName
    try {
      originName = thread.isGroup ?
        (thread.name || thread.id) :
        ((thread.nicknames ? thread.nicknames[thread.id] : null) || this.userCache.get(thread.id).name)
    } catch (err) {
      originName = thread.name || thread.id
    }

    const nickname = thread.nicknames ? thread.nicknames[message.authorId.toString()] : null

    const chatPlugMessage = {
      message: message.message,
      author: {
        username: nickname || sender.name,
        avatar: sender.profilePicLarge,
        externalServiceId: message.authorId.toFixed(),
      },
      externalOriginId: thread.id.toFixed(),
      externalOriginName: originName,
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
