import { FacegramMessageHandler } from '../MessageHandler'
import TelegramBot from 'node-telegram-bot-api'
import { IFacegramMessage, IFacegramAttachement } from '../../models'
import { promisify } from 'util'
import { Subject } from 'rxjs'
import { parse } from 'url'
import log from 'npmlog'

export class TelegramMessageHandler implements FacegramMessageHandler {
  client: TelegramBot
  messageSubject: Subject<IFacegramMessage>
  name = 'telegram'
  handledMessages: any[] = []

  constructor(client: TelegramBot, subject: Subject<IFacegramMessage>) {
    this.client = client
    this.messageSubject = subject
  }

  async onOutgoingMessage(message: TelegramBot.Message) {
    // Duplicates handling
    let listOfAttachments: IFacegramAttachement[] = []
    if (message.photo) {
      const photoId = message.photo[message.photo.length - 1].file_id
      const picUrl = await this.client.getFileLink(photoId)
      if (typeof picUrl === 'string') {
        listOfAttachments = [{
          url: picUrl,
          name: /[^/]*$/.exec(picUrl as string)!![0],
        } as IFacegramAttachement]
      }
    }
    const profilePics = await this.client.getUserProfilePhotos(message.from!!.id)
    const avatar = profilePics instanceof Error ? '' : await this.client.getFileLink(profilePics.photos[0][0].file_id)
    const facegramMessage = {
      message: message.text,
      attachments: listOfAttachments,
      author: {
        avatar,
        username: message.from!!.username,
        id: message.from!!.id.toString(),
      },
      origin: {
        id: message.chat!!.id.toString(),
        name: message.chat!!.first_name,
        service: this.name,
      },
    } as IFacegramMessage

    // send a message to the chat acknowledging receipt of their message
    this.messageSubject.next(facegramMessage)
  }

  onIncomingMessage = async (message: IFacegramMessage) => {
    if (!message.target) return
    const formattedMsg = '*' + message.author.username + '*' + ': ' + message.message
    this.client.sendMessage(
      Number(message.target!!.id),
      formattedMsg,
      { parse_mode: 'Markdown' },
    )
    message.attachments.forEach((attachment) => {
      this.client.sendPhoto(message.target!!.id, attachment.url)
    })
  }

  setClient(client) {
    this.client = client
  }
}
