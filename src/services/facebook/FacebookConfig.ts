import { IChatPlugServiceConfig } from '../../models'

export interface FacebookConfig extends IChatPlugServiceConfig {
  email: string
  password: string
  forceLogin: boolean
}
