import log from 'npmlog'
import { IChatPlugMessage, IChatPlugThread, IChatPlugThreadResult } from '../../models'
import { ChatPlugService } from '../Service'
import fs from 'fs'
import { ChatPlugConfig } from '../../ChatPlugConfig'
import Message from '../../entity/Message'
import { login } from 'libfb'
import MessagingConfig from './MessagingConfig'
import { LogLevel } from '../../Logger'

export default class MessagingService extends ChatPlugService<MessagingConfig> {
  async initialize() {
    this.receiveMessageSubject.subscribe({
      next: (message) => {
      },
    })
  }

  async terminate() {
  }

}
