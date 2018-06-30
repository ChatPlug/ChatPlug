import log from 'npmlog'
import { ChatPlugService } from './services/Service'

export interface ServiceMap {
  [name: string]: ChatPlugService
}

export class ServiceManager {
  services: ServiceMap
  constructor() {
    this.services = {}
  }

  registerService(service: ChatPlugService) {
    this.services[service.name] = service
  }

  getRegisteredServices(): ChatPlugService[] {
    const registeredServices: ChatPlugService[] = []

    for (const key in this.services) {
      registeredServices.push(this.services[key])
    }

    return registeredServices
  }

  async initiateServices() {
    this.getRegisteredServices().forEach(service => {
      if (service.isEnabled) {
        log.info('services', `Service ${service.name} enabled, initializing...`)
        service.initialize()
      } else {
        log.info('services', `Service ${service.name} disabled`)
      }
    })
  }

  async terminateServices() {
    return Promise.all(
      this.getRegisteredServices()
        .filter(service => service.isEnabled)
        .map(service => service.terminate()),
    )
  }
}
