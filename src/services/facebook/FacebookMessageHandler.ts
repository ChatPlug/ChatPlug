import { ChatPlugMessageHandler } from '../MessageHandler'
import { IChatPlugMessage } from '../../models'
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
    if (this.handledMessages.includes(message.messageID)) return log.verbose('facebook', 'Possible duplicate message, ignoring')
    if (this.handledMessages.length > 100) this.handledMessages.splice(100)
    this.handledMessages.push(message.messageID)

    // TODO: add logging to this part of the script
    if (!this.threadCache.has(message.threadId)) {
      this.threadCache.set(message.threadId, await promisify(this.client.getThreadInfo)(message.threadID))
    }

    if (!this.userCache.has(message.senderID)) {
      this.userCache.set(message.senderID, (await promisify(this.client.getUserInfo)(message.senderID))[message.senderID])
      console.log('eluwaa')
    }

    const sender = this.userCache.get(message.senderID)
    const thread = this.threadCache.get(message.threadId)

    let threadName = sender.name

    if (message.isGroup) {
      threadName = thread.threadName
    }

    const chatPlugMessage = {
      message: message.body,
      attachments: message.attachments.map(attach => {
        if (attach.type === 'share') return // TODO: parse share attachments correctly

        let url = attach.image || attach.url
        if (!url) return // failsafe, but it shouldn't happen

        if (url.match(/^(http|https):\/\/l\.facebook\.com\/l\.php/i)) {
          url = parse(url, true).query.u
        }

        if (parse(url).pathname === '/safe_image.php') {
          url = parse(url, true).query.url
        }

        return {
          url,
          name: (parse(url).pathname || 'filename').split('/').pop(),
        }
      }).filter(x => x),
      author: {
        username: thread.nicknames[message.senderID] || sender.name,
        avatar: `https://graph.facebook.com/${message.senderID}/picture?width=128`,
        externalServiceId: message.senderID,
      },
      externalOriginId: thread.threadID,
    } as IChatPlugMessage

    this.messageSubject.next(chatPlugMessage)
  }

  onIncomingMessage = async (message: IChatPlugMessage) => {
    if (!message.externalTargetId) return
    this.client.sendMessage(
      {
        body: `*${message.author.username}*: ${message.message}`,
        attachment: await Promise.all(message.attachments.map(attach => attach.url).map(getStreamFromURL)),
      },
      message.externalTargetId,
      err => { if (err) log.error('facebook', err) },
    )
  }

  setClient(client) {
    this.client = client
  }
}

function getStreamFromURL(url) {
  return new Promise((resolve, reject) => require('https').get(url, res => resolve(res)))
}
