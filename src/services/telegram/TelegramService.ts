import npmlog from 'npmlog'
import { IFacegramMessage } from '../../models'
import { FacegramService } from '../Service'
import { Subject } from 'rxjs'
import { TelegramConfig } from './TelegramConfig'
import telegramMtproto from 'telegram-mtproto'
import crypto from 'crypto'

import { createInterface } from 'readline'
import { ExchangeManager } from '../../ExchangeManager'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

function askForNumber(callback) {
  rl.question('Enter authorization code sent to your telegram account: ', x => {
    rl.close()
    callback(x)
  })
}

const api = {
  invokeWithLayer: 0xda9b0d0d,
  layer: 57,
  initConnection: 0x69796de9,
  api_id: 49631,
  app_version: '1.0.1',
  lang_code: 'en',
}

const server = { dev: false }

export class TelegramService implements FacegramService {
  isEnabled: boolean
  name = 'telegram'
  messageSubject: Subject<IFacegramMessage>
  receiveMessageSubject: Subject<IFacegramMessage> = new Subject()
  config: TelegramConfig
  telegram = MTProto({ api, server })

  constructor(config: TelegramConfig, exchangeManager: ExchangeManager) {
    this.messageSubject = exchangeManager.messageSubject
    this.config = config
    this.isEnabled = config.enabled
  }

  async initialize() {
    log.info(
      'telegram',
      'Sending authorization code to telegram user',
      this.config.telegramUsername,
    )
    const { phone_code_hash } = (await this.telegram('auth.sendCode', {
      phone_number: this.config.phoneNumber,
      api_id: this.config.apiId,
      api_hash: this.config.apiHash,
    })) as any

    const code = await new Promise(result =>
      rl.question(
        'Enter authorization code sent to your telegram account: ',
        result,
      ),
    )

    let result
    try {
      result = (await this.telegram('auth.signIn', {
        phone_code_hash,
        phone_number: this.config.phoneNumber,
        phone_code: code,
      })) as any
    } catch (error) {
      if (error.type !== 'SESSION_PASSWORD_NEEDED') throw error

      const password = await new Promise(result =>
        rl.question('Enter your telegram account\'s password: ', result),
      )

      const { current_salt } = (await this.telegram(
        'account.getPassword',
        {},
      )) as any
      const passwordHash = crypto
        .createHash('sha256')
        .update(Buffer.concat([
          Buffer.from(current_salt),
          Buffer.from(password as string, 'utf8'),
          Buffer.from(current_salt),
        ]) as any)
        .digest()
      result = await this.telegram('auth.checkPassword', {
        passwordHash,
      })
    }
    log.info('telegram', 'Logged in as', result.user.first_name)
  }

  terminate() {
    // currently not available
    // zerobias/telegram-mtproto#122
    return
  }
}
