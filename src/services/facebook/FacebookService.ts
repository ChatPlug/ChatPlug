import log from 'npmlog'
import { IChatPlugMessage, IChatPlugThread, IChatPlugThreadResult } from '../../models'
import { ChatPlugService } from '../Service'
import { Subject } from 'rxjs'
// import { FacebookConfig } from './FacebookConfig'
import facebook from 'facebook-chat-api'
import { createInterface } from 'readline'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import { FacebookMessageHandler } from './FacebookMessageHandler'
import { ChatPlugConfig } from '../../ChatPlugConfig'
import Message from '../../entity/Message'
import FacebookConfig from './FacebookConfig'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

export default class FacebookService extends ChatPlugService<FacebookConfig> {
  messageHandler: FacebookMessageHandler
  facebook: any
  stopListening: any
  importedThreads: IChatPlugThreadResult[] = []
  async initialize() {
    await this.login()

    this.importedThreads = await this.getThreads()
    console.log(this.importedThreads)
    this.messageHandler = new FacebookMessageHandler(this.facebook, this.context.exchangeManager.messageSubject)

    this.receiveMessageSubject.subscribe(this.messageHandler.onIncomingMessage)

    this.stopListening = this.facebook.listen(this.listener)
  }

  listener = async (err, message) => {
    if (err) return log.error('facebook', err)

    // Reconnecting
    if (!message) {
      log.warn('facebook', 'Message is undefined/null, internet connection may be unavailable')
      log.info('facebook', 'Reconnecting...')
      this.stopListening()
      await this.login()
      log.info('facebook', 'Reconnected to Facebook')
      this.messageHandler.setClient(this.facebook)
      this.stopListening = this.facebook.listen(this.listener)
    }
    this.messageHandler.onOutgoingMessage(message)
  }

  async getThreads() {
    return new Promise<IChatPlugThreadResult[]>((res, rej) => {
      this.facebook.getThreadList(50, null, ['INBOX'], (err, list) => {

        res(list.filter((el) => el.name !== null).map((el) => {
          let subtitle = 'Group'
          if (!el.isGroup) {
            subtitle = 'Conversation'
          }
          return {
            subtitle,
            title: el.name,
            id: el.threadID,
            avatarUrl: el.imageSrc || 'https://i.imgur.com/l2QP9Go.png',
          } as IChatPlugThreadResult
        }))
      })
    })
  }

  login() {
    return new Promise((resolve, reject) => {
      facebook(
        {
          email: this.config.email,
          password: this.config.password,
        },
        {
          forceLogin: this.config.forceLogin,
          logLevel: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
        },
        async (err, api) => {
          if (err) {
            if (err.error !== 'login-approval') return reject(err)
            log.info('facebook', 'Login approval pending...')
            const message =
              'Enter login approval code to your Facebook account (SMS or Google Authenticator app): '
            const code = await new Promise(result =>
              rl.question(message, result),
            )
            return err.continue(code)
          }
          this.facebook = api
          log.info('facebook', 'Logged in as', this.config.email)
          resolve()
        },
      )
    })
  }

  async terminate() {
    if (!this.facebook) return log.info('facebook', 'Not logged in')
    await this.facebook.logout
  }

  async searchThreads(query: string): Promise<IChatPlugThreadResult[]> {
    return this.importedThreads.filter((el) => el.title.toLowerCase().indexOf(query.toLowerCase()) > -1)
  }
}
