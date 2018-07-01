import { IChatPlugServiceConfig } from '../../models'

export interface TelegramThreadImporterConfig extends IChatPlugServiceConfig {
  apiId?: string
  apiHash?: string
  phoneNumber?: string
}
