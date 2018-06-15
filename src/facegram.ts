import { FacegramConfig } from './config'
import { IFacegramService, IFacegramMessage } from './models'
import { TelegramService } from './telegramservice'
import { Subject } from 'rxjs'

export class Facegram {
  config: FacegramConfig
  services: Array<IFacegramService>
  incomingMessagePublisher: Subject<IFacegramMessage>

  constructor () {
    this.config = new FacegramConfig()
    this.incomingMessagePublisher = Subject.create()
    this.registerServices()
  }

  registerServices () {
    this.services.push(new TelegramService(this.config.getConfigForServiceName('telegram'), this.incomingMessagePublisher))
  }
}
