import { Collection } from 'discord.js'
import { Subject } from 'rxjs'
import { IChatPlugMessage, MessagePacket } from '../../models'
import { ChatPlugMessageHandler } from '../MessageHandler'
import { Client } from 'libfb'

export class FacebookMessageHandler implements ChatPlugMessageHandler {
  name = 'facebook'
  handledMessages: any[] = []
  threadCache = new Collection<String, any>()
  userCache = new Collection<String, any>()

  constructor(
    public client: Client,
    public messageSubject: Subject<IChatPlugMessage>,
    public id: number,
  ) {}

  async onOutgoingMessage(message) {
    // TODO: add logging to this part of the script
    if (!this.threadCache.has(message.threadId)) {
      this.threadCache.set(
        message.threadId,
        await this.client.getThreadInfo(message.threadId),
      )
    }

    if (!this.userCache.has(message.authorId)) {
      this.userCache.set(
        message.authorId,
        await this.client.getUserInfo(message.authorId),
      )
    }

    const sender = this.userCache.get(message.authorId)
    const thread = this.threadCache.get(message.threadId)

    let originName
    try {
      originName = thread.isGroup
        ? thread.name || thread.id
        : (thread.nicknames ? thread.nicknames[thread.id] : null) ||
          this.userCache.get(thread.id).name
    } catch (err) {
      originName = thread.name || thread.id
    }

    const nickname = thread.nicknames
      ? thread.nicknames[message.authorId.toString()]
      : null

    const chatPlugMessage = {
      message: message.message,
      author: {
        username: nickname || sender.name,
        avatar: sender.profilePicLarge,
        externalServiceId: message.authorId,
      },
      externalOriginId: thread.id,
      externalOriginName: originName,
      originServiceId: this.id,
    } as IChatPlugMessage

    chatPlugMessage.attachments = []
    this.messageSubject.next(chatPlugMessage)
  }

  onIncomingMessage = async (message: MessagePacket) => {
    if (!message.targetThread.externalServiceId) return
    this.client.sendMessage(
      message.targetThread.externalServiceId,
      `*${message.message.author.username}*: ${message.message.content}`,
    )
  }

  setClient(client) {
    this.client = client
  }
}
