import log from 'npmlog'
import { IFacegramMessage } from '../../models'
import { FacegramService } from '../Service'
import { Subject } from 'rxjs'
import { FacebookConfig } from './FacebookConfig'
import facebook from 'facebook-chat-api'
import { createInterface } from 'readline'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

export default class FacebookService implements FacegramService {
  isEnabled: boolean
  name = 'facebook'
  messageSubject: Subject<IFacegramMessage>
  receiveMessageSubject: Subject<IFacegramMessage> = new Subject()
  config: FacebookConfig
  facebook: any

  constructor(config: FacebookConfig, exchangeManager: ExchangeManager, threadConnectionsManager: ThreadConnectionsManager) {
    this.messageSubject = exchangeManager.messageSubject
    this.config = config
    this.isEnabled = config.enabled
  }

  initialize() {
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
            const code = await new Promise(result =>
              rl.question(
                'Enter login approval code to your ' +
                  'Facebook account (SMS or Google Authenticator app): ',
                result,
              ),
            )
            err.continue(code)
          }
          this.facebook = api
          log.info('facebook', 'Logged in as', this.config.email)
          resolve()
        },
      )
    })
  }

  terminate() {
    return new Promise((resolve, reject) =>
      this.facebook.logout(err => (err ? reject(err) : resolve())),
    )
  }
}
