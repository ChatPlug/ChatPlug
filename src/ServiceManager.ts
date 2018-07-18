import log from 'npmlog'
import { ChatPlugService } from './services/Service'
import ChatPlugContext from './ChatPlugContext'
import Service from './entity/Service'
import path from 'path'

export interface ServiceMap {
  [id: number]: ChatPlugService
}

export class ServiceManager {
  services: ServiceMap
  context: ChatPlugContext
  constructor(context: ChatPlugContext) {
    this.context = context
    this.services = {}
  }

  getRegisteredServices(): ChatPlugService[] {
    const registeredServices: ChatPlugService[] = []

    for (const key in this.services) {
      registeredServices.push(this.services[key])
    }

    return registeredServices
  }

  async loadServices() {
    const repo = this.context.connection.getRepository(Service)
    const services = await repo.find({ enabled: true })
    for (const service of services) {
      this.services[service.id] = new (require(path.join(__dirname, 'services', service.moduleName) as any)).Service(service, this.context)
    }
  }

  async initiateServices() {
    this.getRegisteredServices().forEach(service => {
      log.info('services', `Service instance ${service.dbService.instanceName} (${service.dbService.moduleName}) enabled, initializing...`)
      service.initialize()
    })
  }

  async terminateServices() {
    return Promise.all(
      this.getRegisteredServices()
        .map(async service => await service.terminate()),
    )
  }
}
