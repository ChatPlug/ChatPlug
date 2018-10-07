import { ChatPlugMessageHandler } from '../MessageHandler'
import { IChatPlugMessage, IChatPlugAttachement, IChatPlugAttachementType, MessagePacket } from '../../models'
import { promisify } from 'util'
import { Subject } from 'rxjs'
import { parse } from 'url'
import log from 'npmlog'
import ChatPlugContext from '../../ChatPlugContext'
import User from '../../entity/User'

export class SlackMessageHandler implements ChatPlugMessageHandler {
  // client:
  messageSubject: Subject<IChatPlugMessage>
  handledMessages: any[] = []
  context: ChatPlugContext

  constructor(client: Slack, subject: Subject<IChatPlugMessage>, context: ChatPlugContext) {
    this.
    this.messageSubject = subject
    this.context = context
  }

  async onOutgoingMessage(message: Message) {

    console.time('slackPrepare' + message.message_id)
    // Duplicates handling
    let listOfAttachments: IChatPlugAttachement[] = []
    if (message.photo) {
      const photoId = message.photo[message.photo.length - 1].file_id
      // @ts-ignore
      const picUrl = await this.client.getFileLink(photoId)
      if (typeof picUrl === 'string') {
        listOfAttachments = [{
          url: picUrl,
          name: /[^/]*$/.exec(picUrl as string)!![0],
        } as IChatPlugAttachement]
      }
    }

    let avatar: string
    const dbUser = await this.context.connection.getRepository(User).findOne({ externalServiceId: '' + message.from!!.id })

    if (!dbUser) {
      // @ts-ignore
      const profilePics = await this.client.getUserProfilePhotos(message.from!!.id)
      // @ts-ignore
      avatar = (profilePics instanceof Error || profilePics.photos.length < 1) ? '' : await this.client.getFileLink(profilePics.photos[0][0].file_id)
    } else {
      avatar = dbUser.avatarUrl
    }
      /*const attachment = await this.fileIdToAttachement(photoId)
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
    }*/

    const chatPlugMessage = {
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
    this.messageSubject.next(chatPlugMessage)
    console.timeEnd('SlackPrepare' + message.message_id)
  }

  onIncomingMessage = async (message: MessagePacket) => {
    /*console.time('SlackSend' + message.externalOriginId)
    if (!message.externalTargetId) return
    const formattedMsg = '*' + message.author.username + '*' + ': ' + message.message
    // @ts-ignore
    await this.client.sendMessage(
      message.externalTargetId,
      formattedMsg,
      { parse_mode: 'Markdown' } as any,
    )
    for (const attachment of message.attachments) {
      await this.client.sendPhoto(message.externalTargetId, attachment.url)
    }
    console.timeEnd('SlackSend' + message.externalOriginId)*/
  }

  setClient(client) {
    // this.client = client
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
