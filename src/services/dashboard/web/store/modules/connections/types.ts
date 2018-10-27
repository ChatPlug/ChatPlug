export interface ThreadConnection {
  id: number
  connectionName: string
  createdAt: string
  enabled: boolean
}

export interface Thread {
  id: number,
  externalServiceId: string,
  createdAt: string,
  service: any
}

export interface ThreadService {
  id: number
  instanceName: string
  moduleName: string
  enabled: boolean
}
