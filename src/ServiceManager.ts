import log from 'npmlog'
import { ChatPlugService } from './services/Service'
import ChatPlugContext from './ChatPlugContext'
import Service from './entity/Service'
import path from 'path'
import fs from 'fs-extra'
import ServiceModule from './ServiceModule'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

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

  async getAvailableServices() {
    const servicesPath = path.join(__dirname, 'services')
    const allFiles = await fs.readdir(servicesPath)
    const services: ServiceModule[] = []
    for (const f of allFiles) {
      const modulePath = path.join(servicesPath, f)
      if ((await fs.stat(modulePath)).isDirectory()) {
        let manifestData: Object | null = null
        try {
          try {
            manifestData = await fs.readJSON(
              path.join(modulePath, 'manifest.json'),
            )
          } catch (e) {
            throw new Error(
              `Failed to read and parse service manifest (${e.message}).` +
                ` Please ensure that the manifest.json file exists and is valid`,
            )
          }
          if (Array.isArray(manifestData)) {
            // array as a plain would freak out class-transformer
            throw new Error('Service manifest cannot be an array.')
          }
          const s = plainToClass(ServiceModule, manifestData)
          const validationErrors = await validate(s)
          if (validationErrors.length > 0) {
            throw new Error(
              `Failed to validate service manifest: ${validationErrors
                .map(e => e.toString())
                .join(', ')}.`,
            )
          }
          s.modulePath = modulePath
          s.moduleName = f
          s.valid = true
          services.push(s)
        } catch (e) {
          const s = new ServiceModule() // create a dummy service module that will only contain the error, bacause we can't access the manifest anyway.
          s.valid = false
          s.error = e.message
          s.modulePath = modulePath
          s.moduleName = f
          s.displayName = f
          services.push(s)
          continue
        }
      }
    }
    return services
  }
  getServiceForId(id: string): ChatPlugService {
    return this.services[id]
  }

  getRegisteredServices(): ChatPlugService[] {
    return Object.keys(this.services).map(k => this.services[k])
  }

  async loadServices() {
    const repo = this.context.connection.getRepository(Service)
    const services = await repo.find({ enabled: true })
    for (const service of services) {
      this.services[service.id] = new (require(path.join(
        __dirname,
        'services',
        service.moduleName,
      ) as any)).Service(service, this.context)
    }
  }

  async initiateServices() {
    this.getRegisteredServices().forEach(service => {
      log.info(
        'services',
        `Service instance ${service.dbService.instanceName} (${
          service.dbService.moduleName
        }) enabled, initializing...`,
      )
      service.initialize()
    })
  }

  async terminateServices() {
    return Promise.all(
      this.getRegisteredServices().map(
        async service => await service.terminate(),
      ),
    )
  }
}
