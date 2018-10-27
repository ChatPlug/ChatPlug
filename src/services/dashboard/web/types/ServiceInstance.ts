import ServiceModule from './ServiceModule'
import ServiceUser from './ServiceUser'
import ServiceThread from './ServiceThread'
import Log from './Log'

/**
 * See the Service entity this is just a frontend version.
 */
interface ServiceInstance {
  id: number
  instanceName: string
  moduleName: string
  enabled: boolean
  configured: boolean
  serviceModule: ServiceModule
  logs: Log[] | null,
  status: string,
  users: ServiceUser[],
  threads: ServiceThread[]
}

export default ServiceInstance
