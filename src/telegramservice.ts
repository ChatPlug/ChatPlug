import { IFacegramService, IFacegramMessage } from './models'
import { Subject } from 'rxjs'
import { TelegramConfig } from './telegramconfig'

export class TelegramService implements IFacegramService {
  name = 'telegram'
  messageSubject = Subject.create()
  recieveMessageSubject: Subject<IFacegramMessage>
  config: TelegramConfig

  constructor (config: TelegramConfig, recieveSubject: Subject<IFacegramMessage>) {
    this.recieveMessageSubject = recieveSubject
    this.config = config
  }

  initialize (): void {
    console.log('elo')
  }
}
