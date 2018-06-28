import { IFacegramServiceConfig } from '../../models'

export interface GRpcConfig extends IFacegramServiceConfig {
  port: string
}
