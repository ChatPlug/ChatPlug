import { ChatPlugMessageHandler } from '../MessageHandler'
import { IChatPlugMessage } from '../../models'
import { Subject } from 'rxjs'
import log from 'npmlog'
import { Client as DiscordClient, Collection, Webhook, TextChannel } from 'discord.js'

export class DiscordMessageHandler implements ChatPlugMessageHandler {
  client: DiscordClient
  messageSubject: Subject<IChatPlugMessage>
  name = 'discord'
  webhooks: Collection<string, Webhook>

  constructor(client: DiscordClient, subject: Subject<IChatPlugMessage>) {
    this.client = client
    this.messageSubject = subject
  }

  onOutgoingMessage = message => {

    if (!message.cleanContent) return

    if (!message.cleanContent) return

    if (
      this.webhooks.has(message.author.id) ||
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
    } as IChatPlugMessage

    this.messageSubject.next(chatPlugMessage)
  }

  onIncomingMessage = async (message: IChatPlugMessage) => {
    if (!message.externalTargetId) return

    const channel = this.client.channels.get(message.externalTargetId)
    if (!channel || channel.type !== 'text') {
      return log.warn('discord', `Channel ${message.externalTargetId} not found!`)
    }

    let webhook = this.webhooks.find('channelID', message.externalTargetId)
    if (!webhook) {
      webhook = await (channel as TextChannel).createWebhook(
        `ChatPlug ${(channel as TextChannel).name}`.substr(0, 32),
        'https://i.imgur.com/l2QP9Go.png',
      )
      this.webhooks.set(webhook.id, webhook)
    }

    message.message = resolveMentions(message.message, channel)

    webhook
      .send(message.message, {
        username: trim(message.author.username),
        avatarURL: message.author.avatar,
        files: message.attachments.map(file => ({
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
