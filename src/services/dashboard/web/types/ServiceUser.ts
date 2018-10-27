import ServiceInstance from './ServiceInstance';

interface ServiceUser {
  id: number
  service: ServiceInstance
  externalServiceId: string
  avatarUrl: string
  username: string
}

export default ServiceUser
