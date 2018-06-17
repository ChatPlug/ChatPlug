import log from 'npmlog'
import { FacegramService } from './services/Service'

export interface ServiceMap {
  [name: string]: FacegramService
}

export class ServiceManager {
  services: ServiceMap
  constructor () {
    this.services = {}
  }

  registerService (service: FacegramService) {
    this.services[service.name] = service
  }

  getRegisteredServices (): FacegramService[] {
    const registeredServices: FacegramService[] = []

    for (const key in this.services) {
      registeredServices.push(this.services[key])
    }

    return registeredServices
  }

  async initiateServices () {
    this.getRegisteredServices().forEach((service) => {
      if (service.isEnabled) {
        log.info('services', `Service ${service.name} enabled, initializing...`)
        service.initialize()
      } else {
        log.info('services', `Service ${service.name} disabled`)
      }
    })
  }
}
