import log from 'npmlog'
import { IChatPlugMessage, IChatPlugThread } from '../../models'
import { ChatPlugService } from '../Service'
import { Subject } from 'rxjs'
import { FacebookConfig } from './FacebookConfig'
import facebook from 'facebook-chat-api'
import { createInterface } from 'readline'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import { FacebookMessageHandler } from './FacebookMessageHandler'
import { ChatPlugConfig } from '../../ChatPlugConfig'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

export default class FacebookService implements ChatPlugService {
  isEnabled: boolean
  name = 'facebook'
  messageSubject: Subject<IChatPlugMessage>
  receiveMessageSubject: Subject<IChatPlugMessage> = new Subject()
  config: FacebookConfig
  messageHandler: FacebookMessageHandler
  facebook: any
  stopListening: any

  constructor(config: FacebookConfig, exchangeManager: ExchangeManager, threadConnectionsManager: ThreadConnectionsManager, facegramConfig: ChatPlugConfig) {
    this.messageSubject = exchangeManager.messageSubject
    this.config = config
    this.isEnabled = config.enabled
  }

  async initialize () {
    await this.login()

    this.messageHandler = new FacebookMessageHandler(this.facebook, this.messageSubject)

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
      this.login().then(() => {
        log.info('facebook', 'Reconnected to Facebook')
        this.messageHandler.setClient(this.facebook)
        this.stopListening = this.facebook.listen(this.listener)
      })
    }
    this.messageHandler.onOutgoingMessage(message)
  }

  login () {
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
            const message = 'Enter login approval code to your Facebook account (SMS or Google Authenticator app): '
            const code = await new Promise(result => rl.question(message, result))
            return err.continue(code)
          }
          this.facebook = api
          log.info('facebook', 'Logged in as', this.config.email)
          resolve()
        },
      )
    })
  }

  terminate() {
    if (!this.facebook) return log.info('facebook', 'Not logged in')
    return new Promise((resolve, reject) =>
      this.facebook.logout(err => (err ? reject(err) : resolve())),
    )
  }
}
