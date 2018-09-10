import ServiceInstance from 'types/ServiceInstance'
import ServiceModule from 'types/ServiceModule'

interface ServicesState {
  instances: ServiceInstance[]
  modules: ServiceModule[]
  loading: boolean,
  newInstanceId: number,
}
export default ServicesState
