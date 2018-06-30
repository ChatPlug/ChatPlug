import { IChatPlugServiceConfig } from '../../models'

export interface TelegramConfig extends IChatPlugServiceConfig {
  apiId?: string
  masterMode: boolean
  apiHash?: string
  phoneNumber?: string
  telegramUsername?: string
  botToken: string
}
