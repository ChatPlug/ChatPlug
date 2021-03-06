import { Client as DiscordClient, Collection, TextChannel, Webhook } from 'discord.js'
import log from 'npmlog'
import { Subject } from 'rxjs'
import { IChatPlugMessage, MessagePacket } from '../../models'
import { ChatPlugMessageHandler } from '../MessageHandler'

export class DiscordMessageHandler implements ChatPlugMessageHandler {
  client: DiscordClient
  messageSubject: Subject<IChatPlugMessage>
  name = 'discord'
  id: number
  webhooks: Collection<string, Webhook>

  constructor(client: DiscordClient, subject: Subject<IChatPlugMessage>, id: number) {
    this.client = client
    this.messageSubject = subject
    this.id = id
  }

  onOutgoingMessage = message => {
    if (
      this.webhooks && this.webhooks.has(message.author.id) ||
      message.author.username === this.client.user.username
    ) return

    // TODO: embed handling
    const chatPlugMessage = {
      message: message.cleanContent,
      attachments: message.attachments.map(file => ({
        name: file.filename,
        url: file.url,
      })),
      author: {
        username: message.author.username,
        avatar: message.author.avatarURL,
        externalServiceId: message.author.id,
      },
      externalOriginId:  message.channel.id,
      externalOriginName:  message.channel.name,
      originServiceId: this.id,
    } as IChatPlugMessage
    console.log(chatPlugMessage)

    this.messageSubject.next(chatPlugMessage)
  }

  onIncomingMessage = async (packet: MessagePacket) => {
    const message = packet.message
    const channel = this.client.channels.get(packet.targetThread.externalServiceId)
    if (!channel || channel.type !== 'text') {
      return log.warn('discord', `Channel ${packet.targetThread.externalServiceId} not found!`)
    }

    let webhook = this.webhooks.find('channelID', packet.targetThread.externalServiceId)
    if (!webhook) {
      webhook = await (channel as TextChannel).createWebhook(
        `ChatPlug ${(channel as TextChannel).name}`.substr(0, 32),
        'https://i.imgur.com/l2QP9Go.png',
      )
      this.webhooks.set(webhook.id, webhook)
    }

    if (message.content.length === 0) {
      message.content = ''
    }

    console.log(message)

    message.content = resolveMentions(message.content, channel)

    webhook
      .send(message.content, {
        username: trim(message.author.username),
        avatarURL: message.author.avatarUrl,
        files: message.attachements.map(file => ({
          attachment: file.url,
          name: file.name,
        })),
      })
      .then(() => {})
      .catch(err => log.error('discord', err))
  }

  loadWebhooks(webhooks: Collection<string, Webhook>) {
    this.webhooks = webhooks
  }
}

function trim(str: string): string {
  return str.length <= 32 ? str.length === 1 ? str + '.' : str : str.substr(0, 29) + '...'
}

function resolveMentions(message: string, channel: any): string {
  let msg = message
  if (!message) return message
  const matches = msg.match(/@[^# ]{2,32}/g)
  if (!matches || !matches[0]) return msg

  for (let match of matches) {
    match = match.substr(1)

    const role = channel.guild.roles.find(role => role.name.toLowerCase() === match.toLowerCase())
    if (role) {
      if (!role.mentionable) log.verbose('handleMentions', 'Role', match, 'not mentionable!')
      msg = msg.replace(`@${match}`, role)
      break
    }

    const user = channel.guild.members.find(user =>
      (user.nickname && user.nickname.toLowerCase() === match.toLowerCase()) ||
      (user.user.username.toLowerCase() === match.toLowerCase()),
    )
    if (user) {
      msg = msg.replace(`@${match}`, user)
    }
  }

  return msg
}
