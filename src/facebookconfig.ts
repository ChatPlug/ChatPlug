import { IFacegramServiceConfig } from './models'

export interface FacebookConfig extends IFacegramServiceConfig {
  login: string
  password: string
  forceLogin: boolean
}
