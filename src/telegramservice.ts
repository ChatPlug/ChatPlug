import { IFacegramService, IFacegramMessage } from './models'
import { Subject } from 'rxjs'
import { TelegramConfig } from './telegramconfig'
import MTProto from 'telegram-mtproto'
import crypto from 'crypto'

import { createInterface } from 'readline'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

function askForNumber (callback) {
  rl.question('Enter authorization code sent to your telegram account: ', function (x) {
    rl.close()
    callback(x)
  })
}

const api = {
  invokeWithLayer: 0xda9b0d0d,
  layer          : 57,
  initConnection : 0x69796de9,
  api_id         : 49631,
  app_version    : '1.0.1',
  lang_code      : 'en'
}

const server = { dev: false }

export class TelegramService implements IFacegramService {
  name = 'telegram'
  messageSubject = Subject.create()
  receiveMessageSubject: Subject<IFacegramMessage>
  config: TelegramConfig
  telegram = MTProto({ api, server })

  constructor (config: TelegramConfig, receiveSubject: Subject<IFacegramMessage>) {
    this.receiveMessageSubject = receiveSubject
    this.config = config
  }

  async initialize () {
    console.log('Sending authorization code to telegram user ' + this.config.telegramUsername)
    const { phone_code_hash } = await this.telegram('auth.sendCode', {
      phone_number  : this.config.phoneNumber,
      api_id        : this.config.apiId,
      api_hash      : this.config.apiHash
    }) as any

    let code = await new Promise(result => rl.question('Enter authorization code sent to your telegram account: ', result))

    let result
    try {
      result = await this.telegram('auth.signIn', {
        phone_number: this.config.phoneNumber,
        phone_code_hash: phone_code_hash,
        phone_code  : code
      }) as any

    } catch (error) {
      if (error.type !== 'SESSION_PASSWORD_NEEDED') throw error

      let password = await new Promise(result => rl.question('Enter your telegram account\'s password: ', result))

      const { current_salt } = await this.telegram('account.getPassword', {}) as any
      const passwordHash = (crypto.createHash('sha256')
        .update(Buffer.concat([Buffer.from(current_salt), Buffer.from(password as string, 'utf8'), Buffer.from(current_salt)]) as any)
        .digest())
      result = await this.telegram('auth.checkPassword', {
        passwordHash
      })
    }

    console.log(result.user.first_name)
  }
}
