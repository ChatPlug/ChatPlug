import log from 'npmlog'
import TelegramBot from 'node-telegram-bot-api'
import { IFacegramMessage } from '../../models'
import { FacegramService } from '../Service'
import { Subject } from 'rxjs'
import { TelegramConfig } from './TelegramConfig'
import { telegramClientLogin, telegramMtProtoServer } from './MtProtoClientLogic'
import MTProto from 'telegram-mtproto'
import crypto from 'crypto'

import { createInterface } from 'readline'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'

const api = {
  invokeWithLayer: 0xda9b0d0d,
  layer: 57,
  initConnection: 0x69796de9,
  api_id: 49631,
  app_version: '1.0.1',
  lang_code: 'en',
}

const server = {
  dev: false,
}

export default class TelegramService implements FacegramService {
  isEnabled: boolean
  name = 'telegram'
  messageSubject: Subject<IFacegramMessage>
  receiveMessageSubject: Subject<IFacegramMessage> = new Subject()
  config: TelegramConfig
  botClient: any
  telegram = MTProto({ api, server })

  constructor(config: TelegramConfig, exchangeManager: ExchangeManager,  threadConnectionsManager: ThreadConnectionsManager) {
    this.messageSubject = exchangeManager.messageSubject
    this.config = config
    this.isEnabled = config.enabled
    this.botClient = new TelegramBot(this.config.botToken, { polling: true })
  }

  async initialize() {
    if (this.config.masterMode) {
      telegramClientLogin(this.telegram, this.config.apiId, this.config.apiHash, this.config.phoneNumber)
    }

    this.receiveMessageSubject.subscribe({
      next: (msg) => {
        this.botClient.sendMessage(
          Number(msg.target!!.id),
          msg.author.username + ': ' + msg.message,
        )
      },
    })

    this.botClient.on('message', (msg: TelegramBot.Message) => {
      const facegramMessage = {
        message: msg.text,
        attachments: [],
        author: {
          username: msg.from!!.username,
          avatar: '',
          id: msg.from!!.id.toString(),
        },
        origin: {
          id: msg.chat!!.id.toString(),
          name: msg.chat!!.first_name,
          service: this.name,
        },
      } as IFacegramMessage

      // send a message to the chat acknowledging receipt of their message
      this.messageSubject.next(facegramMessage)
    })
  }

  terminate() {
    // currently not available
    // zerobias/telegram-mtproto#122
    return
  }
}
