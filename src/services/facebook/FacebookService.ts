import log from 'npmlog'
import { IFacegramMessage, IFacegramThread } from '../../models'
import { FacegramService } from '../Service'
import { Subject } from 'rxjs'
import { FacebookConfig } from './FacebookConfig'
import facebook from 'facebook-chat-api'
import { createInterface } from 'readline'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import { promisify } from 'util'
import { parse } from 'url'

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
  stopListening: any
  handledMessages: any[] = []

  constructor(config: FacebookConfig, exchangeManager: ExchangeManager, threadConnectionsManager: ThreadConnectionsManager) {
    this.messageSubject = exchangeManager.messageSubject
    this.config = config
    this.isEnabled = config.enabled
  }

  async initialize () {
    await this.login()

    this.receiveMessageSubject.subscribe(async message => {
      if (!message.target) return
      this.facebook.sendMessage(
        {
          body: `*${message.author.username}*: ${message.message}`,
          attachment: await Promise.all(message.attachments.map(attach => attach.url).map(getStreamFromURL)),
        },
        message.target.id,
        err => { if (err) log.error('facebook', err) },
      )
    })

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
        this.stopListening = this.facebook.listen(this.listener)
      })
    }

    // Duplicates handling
    if (this.handledMessages.includes(message.messageID)) return log.verbose('facebook', 'Possible duplicate message, ignoring')
    if (this.handledMessages.length > 100) this.handledMessages.splice(100)
    this.handledMessages.push(message.messageID)

    // TODO: add logging to this part of the script
    const thread = await promisify(this.facebook.getThreadInfo)(message.threadID)
    const sender = (await promisify(this.facebook.getUserInfo)(message.senderID))[message.senderID]

    const facegramMessage = {
      message: message.body,
      attachments: message.attachments.map(attach => {
        if (attach.type === 'share') return // TODO: parse share attachments correctly

        let url = attach.image || attach.url
        if (!url) return // failsafe, but it shouldn't happen

        if (url.match(/^(http|https):\/\/l\.facebook\.com\/l\.php/i)) {
          url = parse(url, true).query.u
        }

        if (parse(url).pathname === '/safe_image.php') {
          url = parse(url, true).query.url
        }

        return {
          url,
          name: (parse(url).pathname || 'filename').split('/').pop(),
        }
      }).filter(x => x),
      author: {
        username: thread.nicknames[message.senderID] || sender.name,
        avatar: `https://graph.facebook.com/${message.senderID}/picture?width=128`,
        id: message.senderID,
      },
      origin: {
        id: thread.threadID,
        service: this.name,
      },
    } as IFacegramMessage

    this.messageSubject.next(facegramMessage)
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

function getStreamFromURL(url) {
  return new Promise((resolve, reject) => require('https').get(url, res => resolve(res)))
}
