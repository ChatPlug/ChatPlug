import { IChatPlugServiceConfig } from '../../models'

export interface TelegramConfig extends IChatPlugServiceConfig {
  botToken: string
}
