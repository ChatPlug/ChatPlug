import log from 'npmlog'
import TelegramBot from 'node-telegram-bot-api'
import { IFacegramMessage, IFacegramAttachement } from '../../models'
import { FacegramService } from '../Service'
import { Subject } from 'rxjs'
import { TelegramConfig } from './TelegramConfig'
import { telegramClientLogin, telegramMtProtoServer } from './MtProtoClientLogic'
import MTProto from 'telegram-mtproto'
import crypto from 'crypto'
import { createInterface } from 'readline'
import { ExchangeManager } from '../../ExchangeManager'
import { ThreadConnectionsManager } from '../../ThreadConnectionsManager'
import { TelegramMessageHandler } from './TelegramMessageHandler'

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
  messageHandler: TelegramMessageHandler
  messageSubject: Subject<IFacegramMessage>
  receiveMessageSubject: Subject<IFacegramMessage> = new Subject()
  config: TelegramConfig
  botClient: TelegramBot
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

    this.messageHandler = new TelegramMessageHandler(this.botClient, this.messageSubject)

    this.receiveMessageSubject.subscribe(this.messageHandler.onIncomingMessage)

    this.botClient.on('message', async (msg: TelegramBot.Message) => {
      this.messageHandler.onOutgoingMessage(msg)
    })
    log.info('telegram', 'Registered bot handlers')
  }

  terminate() {
    this.botClient.stopPolling()
    // currently not available
    // zerobias/telegram-mtproto#122
    return
  }
}
