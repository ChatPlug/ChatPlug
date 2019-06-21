import log from 'npmlog'
import { IChatPlugMessage, IChatPlugThread, IChatPlugThreadResult } from '../../models'
import { ChatPlugService } from '../Service'
import fs from 'fs'
import { FacebookMessageHandler } from './FacebookMessageHandler'
import { ChatPlugConfig } from '../../ChatPlugConfig'
import Message from '../../entity/Message'
import { Client } from 'libfb'
import FacebookConfig from './FacebookConfig'
import { LogLevel } from '../../Logger'

export default class FacebookService extends ChatPlugService<FacebookConfig> {
  messageHandler: FacebookMessageHandler
  importedThreads: IChatPlugThreadResult[] = []
  client: Client
  async initialize() {
    await this.login()

    this.importedThreads = await this.getThreads()
    this.messageHandler = new FacebookMessageHandler(this.client, this.context.exchangeManager.messageSubject, this.id)

    this.receiveMessageSubject.subscribe(this.messageHandler.onIncomingMessage)

    this.client.on('message', message => this.messageHandler.onOutgoingMessage(message))
  }

  listener = async (err, message) => {
    if (err) return log.error('facebook', err)
    this.messageHandler.onOutgoingMessage(message)
  }

  async getThreads() {
    const threads = await this.client.getThreadList(500)
    return threads.filter((el) => el.name !== null).map((el) => {
      let subtitle = 'Group'
      if (!el.isGroup) {
        subtitle = 'Conversation'
      }
      return {
        subtitle,
        title: el.name,
        id: el.id,
      } as IChatPlugThreadResult
    })
  }

  async login() {
    let session = null
    if (fs.existsSync('session.json')) {
      session = JSON.parse(fs.readFileSync('session.json', 'utf8'))
    }

    this.client = new Client({ session: session || undefined, selfListen: false })
    await this.client.login(this.config.email, this.config.password)

    setTimeout(
      () => {
        fs.writeFileSync('session.json', JSON.stringify(this.client.getSession()))
        this.logger.log(LogLevel.INFO, `Logged in as ${this.client.getSession().deviceId}`)
      },
      15000)

  }

  async terminate() {
    if (!this.client) return this.logger.log(LogLevel.INFO, 'Not logged in')

    // await this.facebook.logout
  }

  async searchThreads(query: string): Promise<IChatPlugThreadResult[]> {
    return this.importedThreads.filter((el) => el.title.toLowerCase().indexOf(query.toLowerCase()) > -1)
  }
}
