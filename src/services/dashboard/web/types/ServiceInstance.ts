import ServiceModule from './ServiceModule'

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
}

export default ServiceInstance
