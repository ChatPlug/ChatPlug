import { FacegramMessageHandler } from '../MessageHandler'
import { IFacegramMessage } from '../../models'
import { Subject } from 'rxjs'
import log from 'npmlog'
import { Collection, Webhook, TextChannel } from 'discord.js'

export class DiscordMessageHandler implements FacegramMessageHandler {
  client: any
  messageSubject: Subject<IFacegramMessage>
  name = 'discord'
  webhooks: Collection<string, Webhook>

  constructor(client, subject: Subject<IFacegramMessage>) {
    this.client = client
    this.messageSubject = subject
  }

  onOutgoingMessage = message => {
    if (
      this.webhooks.has(message.author.id) ||
      message.author.username === this.client.user.username
    ) return

    // TODO: embed handling
    const facegramMessage = {
      message: message.cleanContent,
      attachments: message.attachments.map(file => ({
        name: file.filename,
        url: file.url,
      })),
      author: {
        username: message.author.username,
        avatar: message.author.avatarURL,
        id: message.author.id,
      },
      origin: {
        id: message.channel.id,
        service: this.name,
      },
    } as IFacegramMessage

    this.messageSubject.next(facegramMessage)
  }

  onIncomingMessage = async (message: IFacegramMessage) => {
    if (!message.target) return

    const channel = this.client.channels.get(message.target.id)
    if (!channel || channel.type !== 'text') {
      return log.warn('discord', `Channel ${message.target} not found!`)
    }

    let webhook = this.webhooks.find('channelID', message.target.id)
    if (!webhook) {
      webhook = await (channel as TextChannel).createWebhook(
        `Facegram ${(channel as TextChannel).name}`.substr(0, 32),
        'https://github.com/feelfreelinux/facegram/raw/master/facegram_logo.png',
      )
      this.webhooks.set(webhook.id, webhook)
    }

    webhook
      .send(message.message, {
        username: trim(message.author.username),
        avatarURL: message.author.avatar,
        files: message.attachments.map(file => ({
          attachment: file.url,
          name: file.name,
        })),
      })
      .then()
      .catch(err => log.error('discord', err))
  }

  loadWebhooks(webhooks: Collection<string, Webhook>) {
    this.webhooks = webhooks
  }
}

function trim(str: string): string {
  return str.length <= 32 ? str.length === 1 ? str + '.' : str : str.substr(0, 29) + '...'
}
