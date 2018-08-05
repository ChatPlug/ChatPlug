import { FacegramMessageHandler } from '../MessageHandler'
import TelegramBot from 'node-telegram-bot-api'
import { IChatPlugMessage, IChatPlugAttachement, IChatPlugAttachementType } from '../../models'
import { promisify } from 'util'
import { Subject } from 'rxjs'
import { parse } from 'url'
import log from 'npmlog'
import retry from 'async-retry'

export class TelegramMessageHandler implements FacegramMessageHandler {
  client: TelegramBot
  messageSubject: Subject<IChatPlugMessage>
  name = 'telegram'
  handledMessages: any[] = []
  profilePicCache : { [key:number]:string; } = {}

  constructor(client: TelegramBot, subject: Subject<IChatPlugMessage>) {
    this.client = client
    this.messageSubject = subject
  }

  async onOutgoingMessage(message: TelegramBot.Message) {
    // Duplicates handling
    let listOfAttachments: IChatPlugAttachement[] = []
    if (message.photo) {
      const photoId = message.photo[message.photo.length - 1].file_id
      const attachment = await this.fileIdToAttachement(photoId)
      attachment.type = IChatPlugAttachementType.IMAGE
      listOfAttachments = [attachment]
    }

    if (message.sticker) {
      const photoId = message.sticker.file_id
      const attachment = await this.fileIdToAttachement(photoId)
      attachment.type = IChatPlugAttachementType.IMAGE
      listOfAttachments = [attachment]
    }

    if (message.sticker) {
      const photoId = message.sticker.file_id
      const attachment = await this.fileIdToAttachement(photoId)
      attachment.type = IChatPlugAttachementType.IMAGE
      listOfAttachments = [attachment]
    }

    if (message.document) {
      // @ts-ignore
      const photoId = message.document.file_id
      const attachment = await this.fileIdToAttachement(photoId)
      attachment.type = IChatPlugAttachementType.FILE
      listOfAttachments = [attachment]
    }

    if (message.video) {
      // @ts-ignore
      const photoId = message.video.file_id
      const attachment = await this.fileIdToAttachement(photoId)
      attachment.type = IChatPlugAttachementType.VIDEO
      listOfAttachments = [attachment]
    }

    let avatar = this.profilePicCache[message.from!!.id]
    if (!avatar) {
      const profilePics = await this.client.getUserProfilePhotos(message.from!!.id)
      // @ts-ignore
      avatar = (profilePics instanceof Error || profilePics.photos.length < 1) ? '' : await this.client.getFileLink(profilePics.photos[0][0].file_id)
      if (!(profilePics instanceof Error)) {
        this.profilePicCache[message.from!!.id] = avatar
      }
    }

    const facegramMessage = {
      message: message.text,
      attachments: listOfAttachments,
      author: {
        avatar,
        username: message.from!!.username,
        externalServiceId: message.from!!.id.toString(),
      },
      externalOriginId: message.chat!!.id.toString(),
    } as IChatPlugMessage

    // send a message to the chat acknowledging receipt of their message
    this.messageSubject.next(facegramMessage)
  }

  onIncomingMessage = async (message: IChatPlugMessage) => {
    if (!message.externalTargetId) return
    const formattedMsg = '*' + message.author.username + '*' + ': ' + message.message
    this.client.sendMessage(
      Number(message.externalTargetId),
      formattedMsg,
      { parse_mode: 'Markdown' },
    )
    message.attachments.forEach((attachment) => {
      this.client.sendPhoto(message.externalTargetId, attachment.url)
    })
  }

  setClient(client) {
    this.client = client
  }

  async fileIdToAttachement(fileId: string): Promise<IChatPlugAttachement> {
    const picUrl = await retry(async bail => { return this.client.getFileLink(fileId) }, { retries: 3 })

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
