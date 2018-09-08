import ServiceModule from './ServiceModule'
import ServiceUser from './ServiceUser'

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
  users: ServiceUser[]
}

export default ServiceInstance
