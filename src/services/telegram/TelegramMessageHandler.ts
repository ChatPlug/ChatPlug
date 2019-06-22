import { ChatPlugMessageHandler } from '../MessageHandler'
import { IChatPlugMessage, IChatPlugAttachement, MessagePacket } from '../../models'
import { Subject } from 'rxjs'
import { Telegram } from 'telegraf'
import { Message } from 'telegram-typings'
import ChatPlugContext from '../../ChatPlugContext'
import User from '../../entity/User'

export class TelegramMessageHandler implements ChatPlugMessageHandler {
  client: Telegram
  messageSubject: Subject<IChatPlugMessage>
  context: ChatPlugContext

  constructor(client: Telegram, subject: Subject<IChatPlugMessage>, context: ChatPlugContext, public id: number) {
    this.client = client
    this.messageSubject = subject
    this.context = context
  }

  async onOutgoingMessage(message: Message) {

    console.time(`telegramPrepare ${message.message_id}`)
    // Duplicates handling
    let listOfAttachments: IChatPlugAttachement[] = []
    if (message.photo) {

      const photoId = message.photo[message.photo.length - 1].file_id
      const picUrl = await this.client.getFileLink(photoId)
      if (typeof picUrl === 'string') {
        listOfAttachments = [{
          url: picUrl,
          name: /[^/]*$/.exec(picUrl as string)!![0],
        } as IChatPlugAttachement]
      }
    }

    // Handle stickers
    if (message.sticker) {
      const photoId = message.sticker.file_id
      const picUrl = await this.client.getFileLink(photoId)
      if (typeof picUrl === 'string') {
        listOfAttachments = [{
          url: picUrl,
          name: /[^/]*$/.exec(picUrl as string)!![0],
        } as IChatPlugAttachement]
      }
    }

    // Handle documents | GIFs
    if (message.document) {
      const photoId = message.document.file_id
      const picUrl = await this.client.getFileLink(photoId)
      if (typeof picUrl === 'string') {
        listOfAttachments = [{
          url: picUrl,
          name: /[^/]*$/.exec(picUrl as string)!![0],
        } as IChatPlugAttachement]
      }
    }

    let avatar: string
    const dbUser = await this.context.connection.getRepository(User).findOne({ externalServiceId: `${message.from!!.id}` })

    if (!dbUser) {
      // @ts-ignore
      const profilePics = await this.client.getUserProfilePhotos(message.from!!.id)
      // @ts-ignore
      avatar = (profilePics instanceof Error || profilePics.photos.length < 1) ? '' : await this.client.getFileLink(profilePics.photos[0][0].file_id)
    } else {
      avatar = dbUser.avatarUrl
    }

    const chatPlugMessage = {
      message: message.text,
      attachments: listOfAttachments,
      author: {
        avatar,
        username: message.from!!.username,
        externalServiceId: message.from!!.id.toString(),
      },
      externalOriginId: message.chat!!.id.toString(),
      externalOriginName: message.chat!!.title,
      originServiceId: this.id,
    } as IChatPlugMessage

    console.log(chatPlugMessage)

    // send a message to the chat acknowledging receipt of their message
    this.messageSubject.next(chatPlugMessage)
  }

  onIncomingMessage = async (packet: MessagePacket) => {
    const message = packet.message
    if (!packet.targetThread) return
    const formattedMsg = `*${message.author.username}*: ${message.content}`
    // @ts-ignore
    await this.client.sendMessage(
      packet.targetThread.externalServiceId,
      formattedMsg,
      { parse_mode: 'Markdown' } as any,
    )
    for (const attachment of message.attachements) {
      console.log(attachment)
      if (attachment.url.endsWith('.gif')) {
        await this.client.sendAnimation(packet.targetThread.externalServiceId, attachment.url)
      } else {
        await this.client.sendPhoto(packet.targetThread.externalServiceId, attachment.url)
      }
    }
  }

  setClient(client) {
    this.client = client
  }

  async fileIdToAttachement(fileId: string): Promise<IChatPlugAttachement> {
    // @ts-ignore
    const picUrl = await this.client.getFileLink(fileId)

    if (typeof picUrl === 'string') {
      console.log(/[^/]*$/.exec(picUrl as string)!![0])
      return {
        url: picUrl,
        name: /[^/]*$/.exec(picUrl as string)!![0],
      } as IChatPlugAttachement
    }
    throw 'Invalid file type'
  }
}
