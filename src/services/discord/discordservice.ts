import { IFacegramMessage } from '../../models'
import { FacegramService } from '../service'
import { Subject } from 'rxjs'
import { DiscordConfig } from './discordconfig'
import { Client as DiscordClient } from 'discord.js'

export class DiscordService implements FacegramService {
  isEnabled: boolean
  name = 'discord'
  messageSubject = Subject.create()
  receiveMessageSubject: Subject<IFacegramMessage>
  config: DiscordConfig
  discord = new DiscordClient()

  constructor (config: DiscordConfig, receiveSubject: Subject<IFacegramMessage>) {
    this.receiveMessageSubject = receiveSubject
    this.config = config
    this.isEnabled = config.enabled
  }

  async initialize () {
    return this.discord.login(this.config.token)
  }
}
