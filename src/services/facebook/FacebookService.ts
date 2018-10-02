import log from 'npmlog'
import { IChatPlugMessage, IChatPlugThread, IChatPlugThreadResult } from '../../models'
import { ChatPlugService } from '../Service'
import fs from 'fs'
import { FacebookMessageHandler } from './FacebookMessageHandler'
import { ChatPlugConfig } from '../../ChatPlugConfig'
import Message from '../../entity/Message'
import { login } from 'libfb'
import FacebookConfig from './FacebookConfig'
import { LogLevel } from '../../Logger'

export default class FacebookService extends ChatPlugService<FacebookConfig> {
  messageHandler: FacebookMessageHandler
  facebook: any
  stopListening: any
  importedThreads: IChatPlugThreadResult[] = []
  async initialize() {
    await this.login()

    this.importedThreads = await this.getThreads()
    this.messageHandler = new FacebookMessageHandler(this.facebook, this.context.exchangeManager.messageSubject)

    this.receiveMessageSubject.subscribe(this.messageHandler.onIncomingMessage)

    this.stopListening = this.facebook.on('message', (message) => {
      this.messageHandler.onOutgoingMessage(message)
    })
  }

  listener = async (err, message) => {
    if (err) return log.error('facebook', err)
    this.messageHandler.onOutgoingMessage(message)
  }

  async getThreads() {
    const threads = await this.facebook.getThreadList(500)
    return threads.filter((el) => el.name !== null).map((el) => {
      let subtitle = 'Group'
      if (!el.isGroup) {
        subtitle = 'Conversation'
      }
      return {
        subtitle,
        title: el.name,
        id: el.id.toFixed(),
      } as IChatPlugThreadResult
    })
  }

  async login() {
    let session = null
    if (fs.existsSync('session.json')) {
      session = JSON.parse(fs.readFileSync('session.json', 'utf8'))
    }

    if (session) {
      this.facebook = await login(this.config.email, this.config.password, { session, selfListen: true })
    } else {
      this.facebook = await login(this.config.email, this.config.password, { selfListen: true })
    }

    setTimeout(
      () => {
        fs.writeFileSync('session.json', JSON.stringify(this.facebook.getSession()))
        this.log(LogLevel.INFO, 'Logged in as ' + this.facebook.getSession().identifier)
      },
      15000)

  }

  async terminate() {
    if (!this.facebook) return this.log(LogLevel.INFO, 'Not logged in')

    // await this.facebook.logout
  }

  async searchThreads(query: string): Promise<IChatPlugThreadResult[]> {
    return this.importedThreads.filter((el) => el.title.toLowerCase().indexOf(query.toLowerCase()) > -1)
  }
}
