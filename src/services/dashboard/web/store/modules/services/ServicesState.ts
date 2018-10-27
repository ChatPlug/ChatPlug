import ServiceInstance from '../../../types/ServiceInstance'
import ServiceModule from '../../../types/ServiceModule'

interface ServicesState {
  instances: ServiceInstance[]
  modules: ServiceModule[]
  loading: boolean,
  searchResults,
  newInstanceId: number,
}
export default ServicesState
