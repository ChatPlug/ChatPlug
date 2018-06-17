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
        console.log('Initializing enabled service ' + service.name)
        service.initialize()
      } else {
        console.log('Service disabled ' + service.name)
      }
    })
  }
}
