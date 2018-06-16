import { IFacegramService, IFacegramMessage } from './models'
import { Subject } from 'rxjs'
import { DiscordConfig } from './discordconfig'
import { Client as DiscordClient } from 'discord.js'

export class DiscordService implements IFacegramService {
  name = 'discord'
  messageSubject = Subject.create()
  receiveMessageSubject: Subject<IFacegramMessage>
  config: DiscordConfig
  discord = new DiscordClient()

  constructor (config: DiscordConfig, receiveSubject: Subject<IFacegramMessage>) {
    this.receiveMessageSubject = receiveSubject
    this.config = config
  }

  async initialize () {
    return await this.discord.login(this.config.token)
  }
}