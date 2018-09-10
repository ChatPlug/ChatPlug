import ServiceModule from './ServiceModule'
import ServiceUser from './ServiceUser'
import ServiceThread from './ServiceThread'

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
  status: string,
  users: ServiceUser[],
  threads: ServiceThread[]
}

export default ServiceInstance
